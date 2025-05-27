import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSecurityContext, logSecurityEvent, sanitizeInput } from "@/lib/security";
import { apiRateLimit } from "@/lib/rate-limit";

// Generate unique certificate number
function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `CERT-${year}${month}-${timestamp}-${random}`;
}

// Calculate course completion percentage
async function calculateCourseCompletion(studentId: string, courseId: string, sql: any): Promise<{
  completionPercentage: number;
  completedTopics: number;
  totalTopics: number;
  grade: string;
}> {
  const progress = await sql`
    SELECT 
      COUNT(*) as total_topics,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_topics
    FROM student_progress 
    WHERE student_id = ${studentId} AND course_id = ${courseId};
  `;

  const totalTopics = parseInt(progress[0].total_topics);
  const completedTopics = parseInt(progress[0].completed_topics);
  const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Determine grade based on completion
  let grade = 'F';
  if (completionPercentage >= 95) grade = 'A+';
  else if (completionPercentage >= 90) grade = 'A';
  else if (completionPercentage >= 85) grade = 'B+';
  else if (completionPercentage >= 80) grade = 'B';
  else if (completionPercentage >= 75) grade = 'C+';
  else if (completionPercentage >= 70) grade = 'C';
  else if (completionPercentage >= 60) grade = 'D';

  return {
    completionPercentage,
    completedTopics,
    totalTopics,
    grade
  };
}

// Generate certificate data
function generateCertificateData(studentData: any, courseData: any, completionData: any, certificateNumber: string): any {
  return {
    certificateNumber,
    studentName: studentData.fullName,
    courseName: courseData.title,
    instructorName: courseData.instructor_name,
    completionDate: new Date().toISOString(),
    issueDate: new Date().toISOString(),
    grade: completionData.grade,
    score: completionData.completionPercentage,
    duration: courseData.duration,
    level: courseData.level,
    verificationUrl: `https://traininghub.com/verify/${certificateNumber}`,
    template: 'modern',
    design: {
      backgroundColor: '#ffffff',
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      accentColor: '#f59e0b',
      fontFamily: 'Inter, sans-serif',
      logoUrl: '/images/logo.png',
      borderStyle: 'elegant',
      sealStyle: 'modern'
    },
    metadata: {
      totalTopics: completionData.totalTopics,
      completedTopics: completionData.completedTopics,
      timeSpent: '40 hours', // This would be calculated from actual time tracking
      achievements: [
        'Completed all course modules',
        'Submitted all assignments',
        'Participated in live sessions'
      ]
    }
  };
}

async function handlePOST(request: NextRequest) {
  try {
    console.log("[API] Generating course certificate");
    
    // Get security context
    const context = await getSecurityContext();
    if (!context) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { courseId, studentId } = body;

    // Validate inputs
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required", code: "MISSING_COURSE_ID" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedCourseId = sanitizeInput(courseId);
    const sanitizedStudentId = studentId ? sanitizeInput(studentId) : context.dbUser.id;

    // Authorization check
    if (context.role === "student" && sanitizedStudentId !== context.dbUser.id) {
      return NextResponse.json(
        { error: "Students can only generate their own certificates", code: "UNAUTHORIZED_ACCESS" },
        { status: 403 }
      );
    }

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Get student data
    const student = await sql`
      SELECT id, full_name, email FROM users WHERE id = ${sanitizedStudentId};
    `;

    if (student.length === 0) {
      return NextResponse.json(
        { error: "Student not found", code: "STUDENT_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Get course data
    const course = await sql`
      SELECT id, title, instructor_name, duration, level, price
      FROM courses WHERE id = ${sanitizedCourseId};
    `;

    if (course.length === 0) {
      return NextResponse.json(
        { error: "Course not found", code: "COURSE_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Check if student has completed the course order
    const order = await sql`
      SELECT id, order_status, completion_date
      FROM course_orders 
      WHERE student_id = ${sanitizedStudentId} 
      AND course_id = ${sanitizedCourseId}
      AND order_status = 'completed';
    `;

    if (order.length === 0) {
      return NextResponse.json(
        { error: "Student must complete course purchase before generating certificate", code: "COURSE_NOT_PURCHASED" },
        { status: 400 }
      );
    }

    // Calculate course completion
    const completionData = await calculateCourseCompletion(sanitizedStudentId, sanitizedCourseId, sql);

    // Check if course is sufficiently completed (minimum 70%)
    if (completionData.completionPercentage < 70) {
      return NextResponse.json(
        { 
          error: "Course completion must be at least 70% to generate certificate", 
          code: "INSUFFICIENT_COMPLETION",
          currentCompletion: completionData.completionPercentage,
          requiredCompletion: 70
        },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const existingCertificate = await sql`
      SELECT certificate_number, issue_date, certificate_url
      FROM certificates 
      WHERE student_id = ${sanitizedStudentId} AND course_id = ${sanitizedCourseId};
    `;

    if (existingCertificate.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Certificate already exists",
        certificate: existingCertificate[0],
        isExisting: true
      });
    }

    // Generate certificate
    const certificateNumber = generateCertificateNumber();
    const certificateData = generateCertificateData(
      student[0], 
      course[0], 
      completionData, 
      certificateNumber
    );

    // Save certificate to database
    const certificateId = `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await sql`
      INSERT INTO certificates (
        id, certificate_number, student_id, course_id, order_id,
        student_name, course_title, completion_date, grade, score,
        verification_url, template_used, metadata
      ) VALUES (
        ${certificateId}, ${certificateNumber}, ${sanitizedStudentId}, ${sanitizedCourseId},
        ${order[0].id}, ${student[0].full_name}, ${course[0].title},
        CURRENT_TIMESTAMP, ${completionData.grade}, ${completionData.completionPercentage},
        ${certificateData.verificationUrl}, 'modern', ${JSON.stringify(certificateData.metadata)}
      );
    `;

    // Update course order completion date
    await sql`
      UPDATE course_orders 
      SET completion_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${order[0].id};
    `;

    // Log certificate generation
    await logSecurityEvent("CERTIFICATE_GENERATED", {
      certificateId,
      certificateNumber,
      studentId: sanitizedStudentId,
      courseId: sanitizedCourseId,
      grade: completionData.grade,
      score: completionData.completionPercentage
    }, context, request);

    console.log(`[API] Certificate generated: ${certificateNumber}`);

    return NextResponse.json({
      success: true,
      message: "Certificate generated successfully!",
      certificate: {
        id: certificateId,
        certificateNumber,
        studentName: student[0].full_name,
        courseName: course[0].title,
        grade: completionData.grade,
        score: completionData.completionPercentage,
        issueDate: new Date().toISOString(),
        verificationUrl: certificateData.verificationUrl,
        design: certificateData.design,
        metadata: certificateData.metadata
      },
      completionData: {
        completionPercentage: completionData.completionPercentage,
        completedTopics: completionData.completedTopics,
        totalTopics: completionData.totalTopics
      }
    });

  } catch (error) {
    console.error("[API] Error generating certificate:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate", code: "CERTIFICATE_GENERATION_ERROR" },
      { status: 500 }
    );
  }
}

// Get certificate verification
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateNumber = searchParams.get('number');

    if (!certificateNumber) {
      return NextResponse.json(
        { error: "Certificate number is required" },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    const certificate = await sql`
      SELECT 
        certificate_number, student_name, course_title, completion_date,
        issue_date, grade, score, is_verified, template_used
      FROM certificates 
      WHERE certificate_number = ${sanitizeInput(certificateNumber)};
    `;

    if (certificate.length === 0) {
      return NextResponse.json(
        { error: "Certificate not found", code: "CERTIFICATE_NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: certificate[0],
      verified: certificate[0].is_verified
    });

  } catch (error) {
    console.error("[API] Error verifying certificate:", error);
    return NextResponse.json(
      { error: "Failed to verify certificate" },
      { status: 500 }
    );
  }
}

// Export rate-limited handler
export const POST = apiRateLimit(handlePOST);
