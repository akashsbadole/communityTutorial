import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSecurityContext, logSecurityEvent, sanitizeInput } from "@/lib/security";
import { apiRateLimit } from "@/lib/rate-limit";

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Generate unique receipt number
function generateReceiptNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `RCP-${timestamp}-${random}`;
}

// Calculate tax (8% for demo)
function calculateTax(amount: number): number {
  return Math.round(amount * 0.08 * 100) / 100;
}

// Process payment (mock implementation)
async function processPayment(paymentData: any): Promise<{
  success: boolean;
  paymentId?: string;
  error?: string;
}> {
  // Mock payment processing
  // In production, integrate with PayPal, Stripe, Razorpay, etc.
  
  const { amount, paymentMethod, cardDetails } = paymentData;
  
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock success/failure (90% success rate)
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    return {
      success: true,
      paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } else {
    return {
      success: false,
      error: "Payment failed. Please check your payment details and try again."
    };
  }
}

// Generate receipt data
function generateReceiptData(orderData: any, paymentData: any): any {
  return {
    receiptNumber: generateReceiptNumber(),
    orderNumber: orderData.orderNumber,
    studentName: orderData.studentName,
    studentEmail: orderData.studentEmail,
    courseName: orderData.courseName,
    coursePrice: orderData.amount,
    taxAmount: orderData.taxAmount,
    discountAmount: orderData.discountAmount || 0,
    totalAmount: orderData.totalAmount,
    paymentMethod: orderData.paymentMethod,
    paymentId: paymentData.paymentId,
    paymentDate: new Date().toISOString(),
    billingAddress: orderData.billingAddress,
    companyInfo: {
      name: "TrainingHub Learning Platform",
      address: "123 Education Street, Learning City, LC 12345",
      phone: "+1 (555) 123-4567",
      email: "billing@traininghub.com",
      website: "https://traininghub.com"
    }
  };
}

async function handlePOST(request: NextRequest) {
  try {
    console.log("[API] Processing course order");
    
    // Get security context
    const context = await getSecurityContext();
    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    // Only students can place orders
    if (context.role !== "student" && !context.isSuperAdmin) {
      await logSecurityEvent("UNAUTHORIZED_ORDER_ATTEMPT", {
        userId: context.dbUser.id,
        userRole: context.role
      }, context, request);
      
      return NextResponse.json(
        { error: "Only students can place course orders", code: "ROLE_ACCESS_DENIED" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      courseId,
      paymentMethod,
      billingAddress,
      discountCode,
      cardDetails
    } = body;

    // Validate required fields
    if (!courseId || !paymentMethod) {
      return NextResponse.json(
        { error: "Course ID and payment method are required", code: "MISSING_REQUIRED_FIELDS" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedCourseId = sanitizeInput(courseId);
    const sanitizedPaymentMethod = sanitizeInput(paymentMethod);
    const sanitizedDiscountCode = discountCode ? sanitizeInput(discountCode) : null;

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get course details
    const course = await sql`
      SELECT id, title, price, instructor_name, duration, level
      FROM courses 
      WHERE id = ${sanitizedCourseId};
    `;

    if (course.length === 0) {
      return NextResponse.json(
        { error: "Course not found", code: "COURSE_NOT_FOUND" },
        { status: 404 }
      );
    }

    const courseData = course[0];

    // Check if student already enrolled
    const existingOrder = await sql`
      SELECT id, order_status, payment_status
      FROM course_orders 
      WHERE student_id = ${context.dbUser.id} 
      AND course_id = ${sanitizedCourseId}
      AND order_status IN ('completed', 'pending');
    `;

    if (existingOrder.length > 0) {
      return NextResponse.json(
        { 
          error: "You are already enrolled in this course or have a pending order", 
          code: "ALREADY_ENROLLED",
          existingOrder: existingOrder[0]
        },
        { status: 409 }
      );
    }

    // Calculate pricing
    const baseAmount = parseFloat(courseData.price);
    let discountAmount = 0;
    
    // Apply discount if provided
    if (sanitizedDiscountCode) {
      // Mock discount logic (10% for "SAVE10", 20% for "SAVE20")
      if (sanitizedDiscountCode === "SAVE10") {
        discountAmount = baseAmount * 0.1;
      } else if (sanitizedDiscountCode === "SAVE20") {
        discountAmount = baseAmount * 0.2;
      }
    }

    const discountedAmount = baseAmount - discountAmount;
    const taxAmount = calculateTax(discountedAmount);
    const totalAmount = discountedAmount + taxAmount;

    // Generate order details
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = generateOrderNumber();

    // Process payment
    const paymentResult = await processPayment({
      amount: totalAmount,
      paymentMethod: sanitizedPaymentMethod,
      cardDetails
    });

    if (!paymentResult.success) {
      await logSecurityEvent("PAYMENT_FAILED", {
        orderId,
        courseId: sanitizedCourseId,
        amount: totalAmount,
        error: paymentResult.error
      }, context, request);

      return NextResponse.json(
        { 
          error: paymentResult.error || "Payment processing failed", 
          code: "PAYMENT_FAILED" 
        },
        { status: 400 }
      );
    }

    // Create order record
    await sql`
      INSERT INTO course_orders (
        id, student_id, course_id, order_number, amount, currency,
        payment_method, payment_status, payment_id, order_status,
        billing_address, discount_code, discount_amount, tax_amount,
        total_amount, payment_date
      ) VALUES (
        ${orderId}, ${context.dbUser.id}, ${sanitizedCourseId}, ${orderNumber},
        ${baseAmount}, 'USD', ${sanitizedPaymentMethod}, 'completed', ${paymentResult.paymentId},
        'completed', ${JSON.stringify(billingAddress)}, ${sanitizedDiscountCode},
        ${discountAmount}, ${taxAmount}, ${totalAmount}, CURRENT_TIMESTAMP
      );
    `;

    // Generate receipt
    const receiptData = generateReceiptData({
      orderNumber,
      studentName: context.dbUser.fullName,
      studentEmail: context.dbUser.email,
      courseName: courseData.title,
      amount: baseAmount,
      taxAmount,
      discountAmount,
      totalAmount,
      paymentMethod: sanitizedPaymentMethod,
      billingAddress
    }, paymentResult);

    // Save receipt
    const receiptId = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await sql`
      INSERT INTO payment_receipts (
        id, order_id, receipt_number, student_id, course_id,
        amount, payment_method, payment_date, receipt_data
      ) VALUES (
        ${receiptId}, ${orderId}, ${receiptData.receiptNumber}, ${context.dbUser.id},
        ${sanitizedCourseId}, ${totalAmount}, ${sanitizedPaymentMethod},
        CURRENT_TIMESTAMP, ${JSON.stringify(receiptData)}
      );
    `;

    // Initialize student progress for course syllabus
    const syllabus = await sql`
      SELECT id, topics FROM course_syllabus WHERE course_id = ${sanitizedCourseId};
    `;

    for (const module of syllabus) {
      const topics = JSON.parse(module.topics);
      for (const topic of topics) {
        const progressId = `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await sql`
          INSERT INTO student_progress (
            id, student_id, course_id, syllabus_id, topic_id, topic_title, status
          ) VALUES (
            ${progressId}, ${context.dbUser.id}, ${sanitizedCourseId},
            ${module.id}, ${topic.id}, ${topic.title}, 'not_started'
          ) ON CONFLICT (student_id, course_id, syllabus_id, topic_id) DO NOTHING;
        `;
      }
    }

    // Log successful order
    await logSecurityEvent("COURSE_ORDER_COMPLETED", {
      orderId,
      orderNumber,
      courseId: sanitizedCourseId,
      amount: totalAmount,
      paymentMethod: sanitizedPaymentMethod
    }, context, request);

    console.log(`[API] Course order completed: ${orderNumber}`);

    return NextResponse.json({
      success: true,
      message: "Course order completed successfully!",
      order: {
        id: orderId,
        orderNumber,
        courseTitle: courseData.title,
        amount: baseAmount,
        discountAmount,
        taxAmount,
        totalAmount,
        paymentId: paymentResult.paymentId,
        receiptNumber: receiptData.receiptNumber
      },
      receipt: receiptData,
      enrollmentStatus: "active"
    });

  } catch (error) {
    console.error("[API] Error processing course order:", error);
    return NextResponse.json(
      { error: "Failed to process course order", code: "ORDER_PROCESSING_ERROR" },
      { status: 500 }
    );
  }
}

// Export rate-limited handler
export const POST = apiRateLimit(handlePOST);
