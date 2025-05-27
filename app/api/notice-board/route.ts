import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSecurityContext, logSecurityEvent, sanitizeInput } from "@/lib/security";
import { apiRateLimit } from "@/lib/rate-limit";

// Get notices for students or tutors
async function handleGET(request: NextRequest) {
  try {
    console.log("[API] Getting notice board");
    
    // Get security context
    const context = await getSecurityContext();
    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const noticeType = searchParams.get('type');

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    let notices;

    if (context.role === "student") {
      // Students see notices targeted to them
      const enrolledCourses = await sql`
        SELECT course_id FROM course_orders 
        WHERE student_id = ${context.dbUser.id} AND order_status = 'completed';
      `;

      const courseIds = enrolledCourses.map(order => order.course_id);

      if (courseIds.length === 0) {
        return NextResponse.json({
          success: true,
          notices: [],
          message: "No enrolled courses found"
        });
      }

      // Get notices for enrolled courses where student is in target list
      notices = await sql`
        SELECT 
          n.id, n.title, n.content, n.notice_type, n.priority,
          n.is_urgent, n.attachments, n.created_at, n.expires_at,
          n.read_by, c.title as course_title, u.full_name as tutor_name
        FROM notice_board n
        JOIN courses c ON n.course_id = c.id
        JOIN users u ON n.tutor_id = u.id
        WHERE n.course_id = ANY(${courseIds})
        AND (${context.dbUser.id} = ANY(n.target_students) OR array_length(n.target_students, 1) IS NULL)
        AND n.is_active = true
        AND (n.expires_at IS NULL OR n.expires_at > CURRENT_TIMESTAMP)
        ${courseId ? sql`AND n.course_id = ${sanitizeInput(courseId)}` : sql``}
        ${noticeType ? sql`AND n.notice_type = ${sanitizeInput(noticeType)}` : sql``}
        ORDER BY n.is_urgent DESC, n.created_at DESC;
      `;

    } else if (context.role === "tutor") {
      // Tutors see their own notices
      notices = await sql`
        SELECT 
          n.id, n.title, n.content, n.notice_type, n.priority,
          n.is_urgent, n.attachments, n.created_at, n.expires_at,
          n.target_students, n.read_by, c.title as course_title
        FROM notice_board n
        JOIN courses c ON n.course_id = c.id
        WHERE n.tutor_id = ${context.dbUser.id}
        AND n.is_active = true
        ${courseId ? sql`AND n.course_id = ${sanitizeInput(courseId)}` : sql``}
        ${noticeType ? sql`AND n.notice_type = ${sanitizeInput(noticeType)}` : sql``}
        ORDER BY n.created_at DESC;
      `;

    } else if (context.role === "admin" || context.isSuperAdmin) {
      // Admins see all notices for monitoring
      notices = await sql`
        SELECT 
          n.id, n.title, n.content, n.notice_type, n.priority,
          n.is_urgent, n.attachments, n.created_at, n.expires_at,
          n.target_students, n.read_by, c.title as course_title,
          u.full_name as tutor_name
        FROM notice_board n
        JOIN courses c ON n.course_id = c.id
        JOIN users u ON n.tutor_id = u.id
        WHERE n.is_active = true
        ${courseId ? sql`AND n.course_id = ${sanitizeInput(courseId)}` : sql``}
        ${noticeType ? sql`AND n.notice_type = ${sanitizeInput(noticeType)}` : sql``}
        ORDER BY n.created_at DESC;
      `;
    }

    // Process notices for students (mark read status)
    const processedNotices = notices.map(notice => {
      const readBy = notice.read_by || {};
      const isRead = context.role === "student" ? !!readBy[context.dbUser.id] : null;
      
      return {
        id: notice.id,
        title: notice.title,
        content: notice.content,
        noticeType: notice.notice_type,
        priority: notice.priority,
        isUrgent: notice.is_urgent,
        attachments: notice.attachments,
        createdAt: notice.created_at,
        expiresAt: notice.expires_at,
        courseTitle: notice.course_title,
        tutorName: notice.tutor_name,
        isRead,
        targetStudents: context.role !== "student" ? notice.target_students : undefined,
        readBy: context.role !== "student" ? notice.read_by : undefined
      };
    });

    return NextResponse.json({
      success: true,
      notices: processedNotices,
      userRole: context.role
    });

  } catch (error) {
    console.error("[API] Error getting notices:", error);
    return NextResponse.json(
      { error: "Failed to get notices", code: "NOTICE_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

// Create new notice (tutors only)
async function handlePOST(request: NextRequest) {
  try {
    console.log("[API] Creating notice");
    
    // Get security context
    const context = await getSecurityContext();
    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    // Only tutors can create notices
    if (context.role !== "tutor" && !context.isSuperAdmin) {
      return NextResponse.json(
        { error: "Only tutors can create notices", code: "ROLE_ACCESS_DENIED" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      courseId, 
      title, 
      content, 
      noticeType = 'general', 
      priority = 'normal',
      isUrgent = false,
      targetStudents = [],
      attachments = [],
      expiresAt
    } = body;

    // Validate required fields
    if (!courseId || !title || !content) {
      return NextResponse.json(
        { error: "Course ID, title, and content are required", code: "MISSING_REQUIRED_FIELDS" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedCourseId = sanitizeInput(courseId);
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedContent = sanitizeInput(content);
    const sanitizedNoticeType = sanitizeInput(noticeType);
    const sanitizedPriority = sanitizeInput(priority);

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Verify tutor has access to the course
    const courseAccess = await sql`
      SELECT id FROM courses 
      WHERE id = ${sanitizedCourseId} 
      AND (instructor_id = ${context.dbUser.id} OR ${context.isSuperAdmin});
    `;

    if (courseAccess.length === 0) {
      return NextResponse.json(
        { error: "You don't have permission to create notices for this course", code: "COURSE_ACCESS_DENIED" },
        { status: 403 }
      );
    }

    // Get enrolled students for the course if no specific targets
    let finalTargetStudents = targetStudents;
    if (targetStudents.length === 0) {
      const enrolledStudents = await sql`
        SELECT student_id FROM course_orders 
        WHERE course_id = ${sanitizedCourseId} AND order_status = 'completed';
      `;
      finalTargetStudents = enrolledStudents.map(order => order.student_id);
    }

    // Create notice
    const noticeId = `notice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await sql`
      INSERT INTO notice_board (
        id, tutor_id, course_id, title, content, notice_type,
        priority, target_students, is_urgent, attachments, expires_at
      ) VALUES (
        ${noticeId}, ${context.dbUser.id}, ${sanitizedCourseId}, ${sanitizedTitle},
        ${sanitizedContent}, ${sanitizedNoticeType}, ${sanitizedPriority},
        ${finalTargetStudents}, ${isUrgent}, ${JSON.stringify(attachments)},
        ${expiresAt ? new Date(expiresAt).toISOString() : null}
      );
    `;

    // Log notice creation and monitor content
    await logSecurityEvent("NOTICE_CREATED", {
      noticeId,
      courseId: sanitizedCourseId,
      title: sanitizedTitle,
      noticeType: sanitizedNoticeType,
      targetStudentCount: finalTargetStudents.length
    }, context, request);

    // Add to admin monitoring for content review
    const monitoringId = `monitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await sql`
      INSERT INTO admin_monitoring (
        id, monitor_type, content_type, content_id, content_text,
        sender_id, sender_role, risk_level
      ) VALUES (
        ${monitoringId}, 'notice_board', 'notice', ${noticeId},
        ${sanitizedTitle + ' ' + sanitizedContent}, ${context.dbUser.id}, 'tutor', 'low'
      );
    `;

    console.log(`[API] Notice created: ${noticeId}`);

    return NextResponse.json({
      success: true,
      message: "Notice created successfully",
      notice: {
        id: noticeId,
        title: sanitizedTitle,
        content: sanitizedContent,
        noticeType: sanitizedNoticeType,
        priority: sanitizedPriority,
        isUrgent,
        targetStudentCount: finalTargetStudents.length,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("[API] Error creating notice:", error);
    return NextResponse.json(
      { error: "Failed to create notice", code: "NOTICE_CREATION_ERROR" },
      { status: 500 }
    );
  }
}

// Mark notice as read (students only)
export async function PATCH(request: NextRequest) {
  try {
    console.log("[API] Marking notice as read");
    
    // Get security context
    const context = await getSecurityContext();
    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    // Only students can mark notices as read
    if (context.role !== "student") {
      return NextResponse.json(
        { error: "Only students can mark notices as read", code: "ROLE_ACCESS_DENIED" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { noticeId } = body;

    if (!noticeId) {
      return NextResponse.json(
        { error: "Notice ID is required", code: "MISSING_NOTICE_ID" },
        { status: 400 }
      );
    }

    const sanitizedNoticeId = sanitizeInput(noticeId);

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Update read status
    await sql`
      UPDATE notice_board 
      SET read_by = COALESCE(read_by, '{}'::jsonb) || jsonb_build_object(${context.dbUser.id}, ${new Date().toISOString()}),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${sanitizedNoticeId}
      AND ${context.dbUser.id} = ANY(target_students);
    `;

    return NextResponse.json({
      success: true,
      message: "Notice marked as read"
    });

  } catch (error) {
    console.error("[API] Error marking notice as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notice as read" },
      { status: 500 }
    );
  }
}

// Export rate-limited handlers
export const GET = apiRateLimit(handleGET);
export const POST = apiRateLimit(handlePOST);
