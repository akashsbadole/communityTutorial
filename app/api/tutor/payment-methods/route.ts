import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSecurityContext, logSecurityEvent, sanitizeInput } from "@/lib/security";
import { apiRateLimit } from "@/lib/rate-limit";

// Get tutor's payment methods
async function handleGET(request: NextRequest) {
  try {
    console.log("[API] Getting tutor payment methods");
    
    // Get security context
    const context = await getSecurityContext();
    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    // Only tutors can view their payment methods
    if (context.role !== "tutor" && !context.isSuperAdmin) {
      return NextResponse.json(
        { error: "Only tutors can view payment methods", code: "ROLE_ACCESS_DENIED" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tutorId = searchParams.get('tutorId') || context.dbUser.id;

    // Authorization check
    if (context.role === "tutor" && tutorId !== context.dbUser.id) {
      return NextResponse.json(
        { error: "Tutors can only view their own payment methods", code: "UNAUTHORIZED_ACCESS" },
        { status: 403 }
      );
    }

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get payment methods
    const paymentMethods = await sql`
      SELECT 
        id, payment_type, upi_id, qr_code_url, bank_details, paypal_email,
        status, admin_approved, admin_notes, approved_by, approved_at,
        rejected_at, rejection_reason, created_at, updated_at
      FROM tutor_payment_methods 
      WHERE tutor_id = ${tutorId}
      ORDER BY created_at DESC;
    `;

    // Get pending approval requests
    const pendingRequests = await sql`
      SELECT 
        id, request_type, payment_method_data, status, admin_notes,
        reviewed_by, reviewed_at, created_at
      FROM payment_approval_requests 
      WHERE tutor_id = ${tutorId}
      ORDER BY created_at DESC;
    `;

    return NextResponse.json({
      success: true,
      paymentMethods,
      pendingRequests,
      tutorId
    });

  } catch (error) {
    console.error("[API] Error getting payment methods:", error);
    return NextResponse.json(
      { error: "Failed to get payment methods", code: "PAYMENT_METHODS_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

// Submit payment method for approval
async function handlePOST(request: NextRequest) {
  try {
    console.log("[API] Submitting payment method for approval");
    
    // Get security context
    const context = await getSecurityContext();
    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    // Only tutors can submit payment methods
    if (context.role !== "tutor" && !context.isSuperAdmin) {
      return NextResponse.json(
        { error: "Only tutors can submit payment methods", code: "ROLE_ACCESS_DENIED" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { paymentType, upiId, qrCodeUrl, bankDetails, paypalEmail } = body;

    // Validate required fields
    if (!paymentType) {
      return NextResponse.json(
        { error: "Payment type is required", code: "MISSING_PAYMENT_TYPE" },
        { status: 400 }
      );
    }

    // Validate based on payment type
    if (paymentType === 'upi' && !upiId) {
      return NextResponse.json(
        { error: "UPI ID is required for UPI payment method", code: "MISSING_UPI_ID" },
        { status: 400 }
      );
    }

    if (paymentType === 'paypal' && !paypalEmail) {
      return NextResponse.json(
        { error: "PayPal email is required for PayPal payment method", code: "MISSING_PAYPAL_EMAIL" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedPaymentType = sanitizeInput(paymentType);
    const sanitizedUpiId = upiId ? sanitizeInput(upiId) : null;
    const sanitizedPaypalEmail = paypalEmail ? sanitizeInput(paypalEmail) : null;

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Check if tutor already has a pending request for this payment type
    const existingRequest = await sql`
      SELECT id FROM payment_approval_requests 
      WHERE tutor_id = ${context.dbUser.id} 
      AND request_type = ${sanitizedPaymentType}
      AND status = 'pending';
    `;

    if (existingRequest.length > 0) {
      return NextResponse.json(
        { error: "You already have a pending approval request for this payment type", code: "PENDING_REQUEST_EXISTS" },
        { status: 409 }
      );
    }

    // Create approval request
    const requestId = `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentMethodData = {
      paymentType: sanitizedPaymentType,
      upiId: sanitizedUpiId,
      qrCodeUrl: qrCodeUrl || null,
      bankDetails: bankDetails || null,
      paypalEmail: sanitizedPaypalEmail
    };

    await sql`
      INSERT INTO payment_approval_requests (
        id, tutor_id, request_type, payment_method_data, status
      ) VALUES (
        ${requestId}, ${context.dbUser.id}, ${sanitizedPaymentType}, 
        ${JSON.stringify(paymentMethodData)}, 'pending'
      );
    `;

    // Log the request
    await logSecurityEvent("PAYMENT_METHOD_APPROVAL_REQUESTED", {
      requestId,
      tutorId: context.dbUser.id,
      paymentType: sanitizedPaymentType,
      upiId: sanitizedUpiId
    }, context, request);

    console.log(`[API] Payment method approval requested: ${requestId}`);

    return NextResponse.json({
      success: true,
      message: "Payment method submitted for admin approval",
      request: {
        id: requestId,
        paymentType: sanitizedPaymentType,
        status: 'pending',
        submittedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("[API] Error submitting payment method:", error);
    return NextResponse.json(
      { error: "Failed to submit payment method", code: "PAYMENT_METHOD_SUBMISSION_ERROR" },
      { status: 500 }
    );
  }
}

// Update payment method status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    console.log("[API] Updating payment method approval status");
    
    // Check admin access
    const context = await getSecurityContext();
    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    if (context.role !== "admin" && !context.isSuperAdmin) {
      return NextResponse.json(
        { error: "Admin access required", code: "ADMIN_ACCESS_REQUIRED" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestId, action, adminNotes } = body;

    // Validate required fields
    if (!requestId || !action) {
      return NextResponse.json(
        { error: "Request ID and action are required", code: "MISSING_REQUIRED_FIELDS" },
        { status: 400 }
      );
    }

    // Validate action
    const validActions = ['approve', 'reject'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'", code: "INVALID_ACTION" },
        { status: 400 }
      );
    }

    const sanitizedRequestId = sanitizeInput(requestId);
    const sanitizedAction = sanitizeInput(action);
    const sanitizedNotes = adminNotes ? sanitizeInput(adminNotes) : null;

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get the approval request
    const approvalRequest = await sql`
      SELECT id, tutor_id, request_type, payment_method_data, status
      FROM payment_approval_requests 
      WHERE id = ${sanitizedRequestId};
    `;

    if (approvalRequest.length === 0) {
      return NextResponse.json(
        { error: "Approval request not found", code: "REQUEST_NOT_FOUND" },
        { status: 404 }
      );
    }

    const request_data = approvalRequest[0];

    if (request_data.status !== 'pending') {
      return NextResponse.json(
        { error: "Request has already been processed", code: "REQUEST_ALREADY_PROCESSED" },
        { status: 409 }
      );
    }

    if (sanitizedAction === 'approve') {
      // Create approved payment method
      const paymentMethodId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const methodData = JSON.parse(request_data.payment_method_data);

      await sql`
        INSERT INTO tutor_payment_methods (
          id, tutor_id, payment_type, upi_id, qr_code_url, bank_details, 
          paypal_email, status, admin_approved, admin_notes, approved_by, approved_at
        ) VALUES (
          ${paymentMethodId}, ${request_data.tutor_id}, ${request_data.request_type},
          ${methodData.upiId || null}, ${methodData.qrCodeUrl || null}, 
          ${methodData.bankDetails ? JSON.stringify(methodData.bankDetails) : null},
          ${methodData.paypalEmail || null}, 'approved', true, ${sanitizedNotes},
          ${context.dbUser.id}, CURRENT_TIMESTAMP
        );
      `;

      // Update approval request
      await sql`
        UPDATE payment_approval_requests 
        SET status = 'approved', admin_notes = ${sanitizedNotes},
            reviewed_by = ${context.dbUser.id}, reviewed_at = CURRENT_TIMESTAMP
        WHERE id = ${sanitizedRequestId};
      `;

      // Log approval
      await logSecurityEvent("PAYMENT_METHOD_APPROVED", {
        requestId: sanitizedRequestId,
        tutorId: request_data.tutor_id,
        paymentType: request_data.request_type,
        adminId: context.dbUser.id
      }, context, request);

    } else {
      // Reject the request
      await sql`
        UPDATE payment_approval_requests 
        SET status = 'rejected', admin_notes = ${sanitizedNotes},
            reviewed_by = ${context.dbUser.id}, reviewed_at = CURRENT_TIMESTAMP,
            rejected_at = CURRENT_TIMESTAMP, rejection_reason = ${sanitizedNotes}
        WHERE id = ${sanitizedRequestId};
      `;

      // Log rejection
      await logSecurityEvent("PAYMENT_METHOD_REJECTED", {
        requestId: sanitizedRequestId,
        tutorId: request_data.tutor_id,
        paymentType: request_data.request_type,
        adminId: context.dbUser.id,
        reason: sanitizedNotes
      }, context, request);
    }

    console.log(`[API] Payment method ${sanitizedAction}d: ${sanitizedRequestId}`);

    return NextResponse.json({
      success: true,
      message: `Payment method ${sanitizedAction}d successfully`,
      action: sanitizedAction,
      requestId: sanitizedRequestId
    });

  } catch (error) {
    console.error("[API] Error updating payment method status:", error);
    return NextResponse.json(
      { error: "Failed to update payment method status", code: "PAYMENT_METHOD_UPDATE_ERROR" },
      { status: 500 }
    );
  }
}

// Export rate-limited handlers
export const GET = apiRateLimit(handleGET);
export const POST = apiRateLimit(handlePOST);
