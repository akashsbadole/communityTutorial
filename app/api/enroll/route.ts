import { NextResponse } from "next/server"
import { db, getCourseBySlug, initializeDatabase } from "@/lib/db"
import { enrollments } from "@/lib/schema"
import { eq, and } from "drizzle-orm"
import fs from "fs"
import path from "path"
import { Resend } from "resend"

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Initialize database on first request
let dbInitialized = false

export async function POST(request: Request) {
  try {
    // Initialize database if not already done
    if (!dbInitialized) {
      await initializeDatabase()
      dbInitialized = true
    }

    console.log("Database connection status:", db ? "Connected" : "Not connected")

    const { studentName, studentEmail, message, courseSlug } = await request.json()

    // Validation
    if (!studentName?.trim() || !studentEmail?.trim() || !courseSlug?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and course are required" },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(studentEmail.trim())) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Find the course
    const course = await getCourseBySlug(courseSlug)
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check for duplicate enrollment and save to database (with fallback)
    let enrollment: any[] = []
    let enrollmentId = Date.now() // Fallback ID

    try {
      if (db) {
        // Check for duplicate enrollment
        const existingEnrollment = await db
          .select()
          .from(enrollments)
          .where(and(eq(enrollments.studentEmail, studentEmail.trim()), eq(enrollments.courseSlug, courseSlug)))
          .limit(1)

        if (existingEnrollment.length > 0) {
          return NextResponse.json({ error: "You are already enrolled in this course" }, { status: 409 })
        }

        // Save to database
        enrollment = await db
          .insert(enrollments)
          .values({
            studentName: studentName.trim(),
            studentEmail: studentEmail.trim(),
            message: message?.trim() || "",
            courseId: course.id,
            courseSlug: courseSlug,
            status: "pending",
          })
          .returning()

        enrollmentId = enrollment[0].id
      } else {
        console.warn("Database not connected, using file-based storage only")
        // Check for duplicate in JSON file
        const dataDir = path.join(process.cwd(), "data")
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true })
        }

        const jsonPath = path.join(dataDir, "submissions.json")

        if (fs.existsSync(jsonPath)) {
          try {
            const jsonData = fs.readFileSync(jsonPath, "utf8")
            const submissions = JSON.parse(jsonData)
            const existingSubmission = submissions.find(
              (sub: any) => sub.studentEmail.toLowerCase() === studentEmail.trim().toLowerCase() && sub.courseSlug === courseSlug
            )

            if (existingSubmission) {
              return NextResponse.json({ error: "You are already enrolled in this course" }, { status: 409 })
            }
          } catch (error) {
            console.warn("Could not check for duplicates in JSON file:", error)
          }
        }

        // Create mock enrollment object
        enrollment = [{
          id: enrollmentId,
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim(),
          message: message?.trim() || "",
          courseId: course.id,
          courseSlug: courseSlug,
          status: "pending",
          createdAt: new Date(),
        }]
      }
    } catch (dbError) {
      console.warn("[DB] Database operation failed, using file-based storage")
      // Use file-based storage as fallback
      enrollment = [{
        id: enrollmentId,
        studentName: studentName.trim(),
        studentEmail: studentEmail.trim(),
        message: message?.trim() || "",
        courseId: course.id,
        courseSlug: courseSlug,
        status: "pending",
        createdAt: new Date(),
      }]
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data")
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Save to JSON backup
    const jsonPath = path.join(dataDir, "submissions.json")
    let submissions: any[] = []

    try {
      if (fs.existsSync(jsonPath)) {
        const jsonData = fs.readFileSync(jsonPath, "utf8")
        submissions = JSON.parse(jsonData)

        // Additional duplicate check for file-based storage
        if (!db) {
          const existingSubmission = submissions.find(
            (sub: any) => sub.studentEmail.toLowerCase() === studentEmail.trim().toLowerCase() && sub.courseSlug === courseSlug
          )

          if (existingSubmission) {
            return NextResponse.json({ error: "You are already enrolled in this course" }, { status: 409 })
          }
        }
      }
    } catch (error) {
      console.warn("Could not read existing JSON file, starting fresh")
      submissions = []
    }

    const submissionData = {
      id: enrollmentId,
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim(),
      courseSlug,
      courseName: course.name,
      message: message?.trim() || "",
      status: "pending",
      submittedAt: new Date().toISOString(),
    }

    submissions.push(submissionData)

    try {
      fs.writeFileSync(jsonPath, JSON.stringify(submissions, null, 2))
    } catch (error) {
      console.warn("Could not write to JSON backup file:", error)
    }

    // Save to CSV backup
    const csvPath = path.join(dataDir, "submissions.csv")
    const csvLine = `"${submissionData.id}","${studentName.trim()}","${studentEmail.trim()}","${courseSlug}","${course.name}","${(message || "").replace(/"/g, '""')}","pending","${submissionData.submittedAt}"\n`

    try {
      if (!fs.existsSync(csvPath)) {
        // Write header if file doesn't exist
        fs.writeFileSync(csvPath, "ID,Name,Email,Course Slug,Course Name,Message,Status,Submitted At\n")
      }
      fs.appendFileSync(csvPath, csvLine)
    } catch (error) {
      console.warn("Could not write to CSV backup file:", error)
    }

    // Send email notifications using Resend
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@trainingsite.com"
      const adminEmail = process.env.ADMIN_EMAIL || "admin@trainingsite.com"

      // Email to admin
      await resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        subject: `[Admin] New Enrollment: ${course.name}`,
        html: `
          <h2>New Course Enrollment</h2>
          <p><strong>Course:</strong> ${course.name}</p>
          <p><strong>Student Name:</strong> ${studentName.trim()}</p>
          <p><strong>Student Email:</strong> ${studentEmail.trim()}</p>
          <p><strong>Message:</strong> ${message?.trim() || "No message provided"}</p>
          <p><strong>Enrollment Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Enrollment ID:</strong> ${enrollmentId}</p>
        `,
      })

      // Email to tutor
      await resend.emails.send({
        from: fromEmail,
        to: [course.tutorEmail],
        subject: `[Tutor] New Student Enrollment: ${course.name}`,
        html: `
          <h2>New Student Enrolled</h2>
          <p>Hello,</p>
          <p>A new student has enrolled in your course: <strong>${course.name}</strong></p>
          <p><strong>Student Details:</strong></p>
          <ul>
            <li>Name: ${studentName.trim()}</li>
            <li>Email: ${studentEmail.trim()}</li>
            <li>Message: ${message?.trim() || "No message provided"}</li>
          </ul>
          <p>Please reach out to the student to welcome them and provide next steps.</p>
          <p>Best regards,<br>TrainingHub Team</p>
        `,
      })

      // Confirmation email to student
      await resend.emails.send({
        from: fromEmail,
        to: [studentEmail.trim()],
        subject: `Welcome to ${course.name}!`,
        html: `
          <h2>Enrollment Confirmation</h2>
          <p>Hello ${studentName.trim()},</p>
          <p>Thank you for enrolling in <strong>${course.name}</strong>!</p>
          <p><strong>Course Details:</strong></p>
          <ul>
            <li>Course: ${course.name}</li>
            <li>Price: ${course.price}</li>
            <li>Duration: ${course.duration}</li>
            <li>Level: ${course.level}</li>
          </ul>
          <p>Your enrollment has been confirmed and you will receive further instructions from your course tutor within 24 hours.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Welcome to TrainingHub!</p>
          <p>Best regards,<br>The TrainingHub Team</p>
        `,
      })

      console.log("All email notifications sent successfully")
    } catch (emailError) {
      console.error("Error sending emails:", emailError)
      // Don't fail the enrollment if email fails
    }

    return NextResponse.json({
      message: "Enrollment submitted successfully",
      enrollmentId: enrollmentId,
    })
  } catch (error) {
    console.error("Enrollment error:", error)
    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 })
  }
}
