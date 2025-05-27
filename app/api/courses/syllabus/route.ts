import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSecurityContext, logSecurityEvent, sanitizeInput } from "@/lib/security";
import { apiRateLimit } from "@/lib/rate-limit";

// Get course syllabus with student progress
async function handleGET(request: NextRequest) {
  try {
    console.log("[API] Getting course syllabus with progress");
    
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
    const studentId = searchParams.get('studentId');

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required", code: "MISSING_COURSE_ID" },
        { status: 400 }
      );
    }

    const sanitizedCourseId = sanitizeInput(courseId);
    const sanitizedStudentId = studentId ? sanitizeInput(studentId) : context.dbUser.id;

    // Authorization check
    if (context.role === "student" && sanitizedStudentId !== context.dbUser.id) {
      return NextResponse.json(
        { error: "Students can only view their own progress", code: "UNAUTHORIZED_ACCESS" },
        { status: 403 }
      );
    }

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Check if student is enrolled
    const enrollment = await sql`
      SELECT id, order_status FROM course_orders 
      WHERE student_id = ${sanitizedStudentId} 
      AND course_id = ${sanitizedCourseId}
      AND order_status = 'completed';
    `;

    if (enrollment.length === 0 && context.role === "student") {
      return NextResponse.json(
        { error: "Student must be enrolled in the course to view syllabus", code: "NOT_ENROLLED" },
        { status: 403 }
      );
    }

    // Get course details
    const course = await sql`
      SELECT id, title, instructor_name, duration, level, description
      FROM courses WHERE id = ${sanitizedCourseId};
    `;

    if (course.length === 0) {
      return NextResponse.json(
        { error: "Course not found", code: "COURSE_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Get syllabus with progress
    const syllabusData = await sql`
      SELECT 
        s.id, s.module_number, s.module_title, s.module_description,
        s.topics, s.estimated_hours, s.learning_objectives, s.resources,
        s.is_mandatory, s.order_index
      FROM course_syllabus s
      WHERE s.course_id = ${sanitizedCourseId}
      ORDER BY s.order_index;
    `;

    // Get student progress for each topic
    const progressData = await sql`
      SELECT 
        syllabus_id, topic_id, topic_title, status, completion_date,
        time_spent, notes, rating
      FROM student_progress 
      WHERE student_id = ${sanitizedStudentId} AND course_id = ${sanitizedCourseId};
    `;

    // Create progress map for quick lookup
    const progressMap = new Map();
    progressData.forEach(progress => {
      const key = `${progress.syllabus_id}_${progress.topic_id}`;
      progressMap.set(key, progress);
    });

    // Combine syllabus with progress
    const syllabusWithProgress = syllabusData.map(module => {
      const topics = JSON.parse(module.topics);
      const topicsWithProgress = topics.map((topic: any) => {
        const key = `${module.id}_${topic.id}`;
        const progress = progressMap.get(key);
        
        return {
          ...topic,
          status: progress?.status || 'not_started',
          completionDate: progress?.completion_date,
          timeSpent: progress?.time_spent || 0,
          notes: progress?.notes,
          rating: progress?.rating
        };
      });

      // Calculate module completion
      const completedTopics = topicsWithProgress.filter(t => t.status === 'completed').length;
      const totalTopics = topicsWithProgress.length;
      const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

      return {
        id: module.id,
        moduleNumber: module.module_number,
        moduleTitle: module.module_title,
        moduleDescription: module.module_description,
        estimatedHours: module.estimated_hours,
        learningObjectives: module.learning_objectives,
        resources: module.resources,
        isMandatory: module.is_mandatory,
        orderIndex: module.order_index,
        topics: topicsWithProgress,
        completionPercentage,
        completedTopics,
        totalTopics
      };
    });

    // Calculate overall course progress
    const totalTopicsInCourse = syllabusWithProgress.reduce((sum, module) => sum + module.totalTopics, 0);
    const completedTopicsInCourse = syllabusWithProgress.reduce((sum, module) => sum + module.completedTopics, 0);
    const overallProgress = totalTopicsInCourse > 0 ? Math.round((completedTopicsInCourse / totalTopicsInCourse) * 100) : 0;

    // Log access
    await logSecurityEvent("SYLLABUS_ACCESSED", {
      courseId: sanitizedCourseId,
      studentId: sanitizedStudentId,
      overallProgress
    }, context, request);

    return NextResponse.json({
      success: true,
      course: course[0],
      syllabus: syllabusWithProgress,
      progress: {
        overallProgress,
        completedTopics: completedTopicsInCourse,
        totalTopics: totalTopicsInCourse,
        totalModules: syllabusWithProgress.length,
        completedModules: syllabusWithProgress.filter(m => m.completionPercentage === 100).length
      },
      enrollment: enrollment[0] || null
    });

  } catch (error) {
    console.error("[API] Error getting syllabus:", error);
    return NextResponse.json(
      { error: "Failed to get course syllabus", code: "SYLLABUS_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

// Update topic progress
async function handlePOST(request: NextRequest) {
  try {
    console.log("[API] Updating topic progress");
    
    // Get security context
    const context = await getSecurityContext();
    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    // Only students can update their own progress
    if (context.role !== "student" && !context.isSuperAdmin) {
      return NextResponse.json(
        { error: "Only students can update progress", code: "ROLE_ACCESS_DENIED" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { courseId, syllabusId, topicId, status, timeSpent, notes, rating } = body;

    // Validate required fields
    if (!courseId || !syllabusId || !topicId || !status) {
      return NextResponse.json(
        { error: "Course ID, syllabus ID, topic ID, and status are required", code: "MISSING_REQUIRED_FIELDS" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['not_started', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: not_started, in_progress, or completed", code: "INVALID_STATUS" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedCourseId = sanitizeInput(courseId);
    const sanitizedSyllabusId = sanitizeInput(syllabusId);
    const sanitizedTopicId = sanitizeInput(topicId);
    const sanitizedStatus = sanitizeInput(status);
    const sanitizedNotes = notes ? sanitizeInput(notes) : null;

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Check if student is enrolled
    const enrollment = await sql`
      SELECT id FROM course_orders 
      WHERE student_id = ${context.dbUser.id} 
      AND course_id = ${sanitizedCourseId}
      AND order_status = 'completed';
    `;

    if (enrollment.length === 0) {
      return NextResponse.json(
        { error: "Student must be enrolled in the course", code: "NOT_ENROLLED" },
        { status: 403 }
      );
    }

    // Get topic title from syllabus
    const syllabus = await sql`
      SELECT topics FROM course_syllabus WHERE id = ${sanitizedSyllabusId};
    `;

    if (syllabus.length === 0) {
      return NextResponse.json(
        { error: "Syllabus module not found", code: "SYLLABUS_NOT_FOUND" },
        { status: 404 }
      );
    }

    const topics = JSON.parse(syllabus[0].topics);
    const topic = topics.find((t: any) => t.id === sanitizedTopicId);

    if (!topic) {
      return NextResponse.json(
        { error: "Topic not found in syllabus", code: "TOPIC_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Update or insert progress
    const progressId = `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const completionDate = sanitizedStatus === 'completed' ? 'CURRENT_TIMESTAMP' : null;

    await sql`
      INSERT INTO student_progress (
        id, student_id, course_id, syllabus_id, topic_id, topic_title,
        status, completion_date, time_spent, notes, rating
      ) VALUES (
        ${progressId}, ${context.dbUser.id}, ${sanitizedCourseId}, ${sanitizedSyllabusId},
        ${sanitizedTopicId}, ${topic.title}, ${sanitizedStatus}, 
        ${completionDate ? sql`CURRENT_TIMESTAMP` : null},
        ${timeSpent || 0}, ${sanitizedNotes}, ${rating || null}
      )
      ON CONFLICT (student_id, course_id, syllabus_id, topic_id) 
      DO UPDATE SET 
        status = ${sanitizedStatus},
        completion_date = ${completionDate ? sql`CURRENT_TIMESTAMP` : null},
        time_spent = COALESCE(${timeSpent}, student_progress.time_spent),
        notes = COALESCE(${sanitizedNotes}, student_progress.notes),
        rating = COALESCE(${rating}, student_progress.rating),
        updated_at = CURRENT_TIMESTAMP;
    `;

    // Log progress update
    await logSecurityEvent("TOPIC_PROGRESS_UPDATED", {
      courseId: sanitizedCourseId,
      syllabusId: sanitizedSyllabusId,
      topicId: sanitizedTopicId,
      status: sanitizedStatus,
      timeSpent: timeSpent || 0
    }, context, request);

    console.log(`[API] Topic progress updated: ${sanitizedTopicId} -> ${sanitizedStatus}`);

    return NextResponse.json({
      success: true,
      message: "Topic progress updated successfully",
      progress: {
        topicId: sanitizedTopicId,
        topicTitle: topic.title,
        status: sanitizedStatus,
        timeSpent: timeSpent || 0,
        completionDate: sanitizedStatus === 'completed' ? new Date().toISOString() : null
      }
    });

  } catch (error) {
    console.error("[API] Error updating topic progress:", error);
    return NextResponse.json(
      { error: "Failed to update topic progress", code: "PROGRESS_UPDATE_ERROR" },
      { status: 500 }
    );
  }
}

// Export rate-limited handlers
export const GET = apiRateLimit(handleGET);
export const POST = apiRateLimit(handlePOST);
