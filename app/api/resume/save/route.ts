import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { resumes } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resumeData = await request.json();

    // Validate required fields
    if (!resumeData.personalInfo?.fullName || !resumeData.personalInfo?.email) {
      return NextResponse.json(
        { error: "Full name and email are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Check if resume already exists for this user
    const existingResume = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .limit(1);

    if (existingResume.length > 0) {
      // Update existing resume
      await db
        .update(resumes)
        .set({
          data: JSON.stringify(resumeData),
          updatedAt: now,
        })
        .where(eq(resumes.userId, userId));

      return NextResponse.json({
        success: true,
        message: "Resume updated successfully",
        id: existingResume[0].id,
      });
    } else {
      // Create new resume
      const [newResume] = await db
        .insert(resumes)
        .values({
          userId,
          data: JSON.stringify(resumeData),
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return NextResponse.json({
        success: true,
        message: "Resume saved successfully",
        id: newResume.id,
      });
    }
  } catch (error) {
    console.error("Error saving resume:", error);
    return NextResponse.json(
      { error: "Failed to save resume" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId));

    return NextResponse.json({
      success: true,
      resumes: userResumes.map(resume => ({
        id: resume.id,
        data: JSON.parse(resume.data),
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
