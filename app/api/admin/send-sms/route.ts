import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db";
import twilio from "twilio";

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Sending SMS notifications");
    
    // Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user from database
    const dbUser = await getUserByClerkId(user.id);
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Check if user is super admin
    const isSuperAdmin = dbUser.role === "admin" || user.emailAddresses?.[0]?.emailAddress === "admin@traininghub.com";
    
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Super Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, message, targetUsers, sessionId, courseId } = body;

    if (!type || !message) {
      return NextResponse.json(
        { error: "SMS type and message are required" },
        { status: 400 }
      );
    }

    // Check if Twilio is configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.log("[API] Twilio not configured, simulating SMS send");
      
      // Simulate SMS sending for demo
      const mockEnrolledStudents = [
        { id: "student_001", name: "Alice Johnson", phone: "+1234567890" },
        { id: "student_002", name: "Bob Smith", phone: "+1234567891" },
        { id: "student_003", name: "Carol Davis", phone: "+1234567892" },
      ];

      const sentCount = mockEnrolledStudents.length;
      
      // Log SMS notifications to database (mock)
      for (const student of mockEnrolledStudents) {
        const smsId = `sms_${Date.now()}_${student.id}`;
        const smsRecord = {
          id: smsId,
          userId: student.id,
          phoneNumber: student.phone,
          message,
          smsType: type,
          sessionId: sessionId || null,
          courseId: courseId || null,
          status: "sent", // simulated
          twilioSid: `mock_sid_${smsId}`,
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        
        console.log("[API] Mock SMS sent:", smsRecord);
      }

      return NextResponse.json({
        success: true,
        message: "SMS notifications sent successfully (simulated)",
        sentCount,
        isDemoMode: true,
        recipients: mockEnrolledStudents.map(s => ({ name: s.name, phone: s.phone })),
      });
    }

    // Real Twilio implementation
    let enrolledStudents = [];
    
    if (targetUsers && targetUsers.length > 0) {
      // Send to specific users
      enrolledStudents = targetUsers;
    } else {
      // Get all enrolled students for upcoming classes
      // In a real implementation, query the database for enrolled students
      enrolledStudents = [
        { id: "student_001", name: "Alice Johnson", phone: "+1234567890" },
        { id: "student_002", name: "Bob Smith", phone: "+1234567891" },
        { id: "student_003", name: "Carol Davis", phone: "+1234567892" },
      ];
    }

    const smsResults = [];
    let successCount = 0;
    let failureCount = 0;

    for (const student of enrolledStudents) {
      try {
        // Send SMS via Twilio
        const smsResponse = await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: student.phone,
        });

        // Log successful SMS to database
        const smsId = `sms_${Date.now()}_${student.id}`;
        const smsRecord = {
          id: smsId,
          userId: student.id,
          phoneNumber: student.phone,
          message,
          smsType: type,
          sessionId: sessionId || null,
          courseId: courseId || null,
          status: "sent",
          twilioSid: smsResponse.sid,
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        // In a real implementation, save to sms_notifications table
        console.log("[API] SMS sent successfully:", smsRecord);
        
        smsResults.push({
          studentId: student.id,
          studentName: student.name,
          phone: student.phone,
          status: "sent",
          twilioSid: smsResponse.sid,
        });
        
        successCount++;

      } catch (smsError) {
        console.error(`[API] Failed to send SMS to ${student.phone}:`, smsError);
        
        // Log failed SMS to database
        const smsId = `sms_${Date.now()}_${student.id}`;
        const smsRecord = {
          id: smsId,
          userId: student.id,
          phoneNumber: student.phone,
          message,
          smsType: type,
          sessionId: sessionId || null,
          courseId: courseId || null,
          status: "failed",
          errorMessage: smsError.message,
          createdAt: new Date().toISOString(),
        };

        // In a real implementation, save to sms_notifications table
        console.log("[API] SMS failed:", smsRecord);
        
        smsResults.push({
          studentId: student.id,
          studentName: student.name,
          phone: student.phone,
          status: "failed",
          error: smsError.message,
        });
        
        failureCount++;
      }
    }

    console.log(`[API] SMS batch completed: ${successCount} sent, ${failureCount} failed`);

    return NextResponse.json({
      success: true,
      message: `SMS notifications processed: ${successCount} sent, ${failureCount} failed`,
      sentCount: successCount,
      failedCount: failureCount,
      totalCount: enrolledStudents.length,
      results: smsResults,
    });

  } catch (error) {
    console.error("[API] Error sending SMS notifications:", error);
    return NextResponse.json(
      { error: "Failed to send SMS notifications" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("[API] Getting SMS notification history");
    
    // Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user from database
    const dbUser = await getUserByClerkId(user.id);
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Check if user is super admin
    const isSuperAdmin = dbUser.role === "admin" || user.emailAddresses?.[0]?.emailAddress === "admin@traininghub.com";
    
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Super Admin access required" },
        { status: 403 }
      );
    }

    // In a real implementation, fetch from sms_notifications table
    const smsHistory = [
      {
        id: "sms_001",
        userId: "student_001",
        userName: "Alice Johnson",
        phoneNumber: "+1234567890",
        message: "Reminder: Your WordPress class starts in 1 hour.",
        smsType: "upcoming_class",
        status: "sent",
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sms_002",
        userId: "student_002",
        userName: "Bob Smith",
        phoneNumber: "+1234567891",
        message: "Your assignment deadline is tomorrow.",
        smsType: "assignment_reminder",
        status: "sent",
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      smsHistory,
      totalSent: smsHistory.filter(sms => sms.status === "sent").length,
      totalFailed: smsHistory.filter(sms => sms.status === "failed").length,
      isDummyData: true,
    });

  } catch (error) {
    console.error("[API] Error getting SMS history:", error);
    return NextResponse.json(
      { error: "Failed to get SMS history" },
      { status: 500 }
    );
  }
}
