import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { resumeData, format } = await request.json();

    if (!resumeData || !format) {
      return NextResponse.json(
        { error: "Resume data and format are required" },
        { status: 400 }
      );
    }

    // For now, we'll return a simple response
    // In a real implementation, you would use libraries like:
    // - jsPDF for PDF generation
    // - html2canvas for HTML to image conversion
    // - docx for Word document generation

    switch (format) {
      case "pdf":
        return generatePDF(resumeData);
      case "docx":
        return generateDOCX(resumeData);
      case "html":
        return generateHTML(resumeData);
      default:
        return NextResponse.json(
          { error: "Unsupported format" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error exporting resume:", error);
    return NextResponse.json(
      { error: "Failed to export resume" },
      { status: 500 }
    );
  }
}

async function generatePDF(resumeData: any) {
  // This is a placeholder implementation
  // In a real app, you would use jsPDF or similar library
  
  const htmlContent = generateHTMLContent(resumeData);
  
  // For now, return HTML as text
  return new NextResponse(htmlContent, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": "attachment; filename=resume.html",
    },
  });
}

async function generateDOCX(resumeData: any) {
  // This is a placeholder implementation
  // In a real app, you would use docx library
  
  const htmlContent = generateHTMLContent(resumeData);
  
  return new NextResponse(htmlContent, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": "attachment; filename=resume.html",
    },
  });
}

async function generateHTML(resumeData: any) {
  const htmlContent = generateHTMLContent(resumeData);
  
  return new NextResponse(htmlContent, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": "attachment; filename=resume.html",
    },
  });
}

function generateHTMLContent(resumeData: any) {
  const { personalInfo, experience, education, skills } = resumeData;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || "Resume"}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #2563eb;
            font-size: 2.5em;
        }
        .contact-info {
            margin: 10px 0;
            font-size: 0.9em;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #2563eb;
            border-bottom: 1px solid #2563eb;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .experience-item, .education-item {
            margin-bottom: 20px;
        }
        .experience-item h3, .education-item h3 {
            margin: 0;
            color: #1f2937;
        }
        .company, .institution {
            font-weight: bold;
            color: #6b7280;
        }
        .date {
            font-style: italic;
            color: #6b7280;
            font-size: 0.9em;
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skill {
            background: #e5e7eb;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${personalInfo.fullName || "Your Name"}</h1>
        <div class="contact-info">
            ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ""}
            ${personalInfo.phone ? ` • <span>${personalInfo.phone}</span>` : ""}
            ${personalInfo.location ? ` • <span>${personalInfo.location}</span>` : ""}
        </div>
        ${personalInfo.website ? `<div><a href="${personalInfo.website}">${personalInfo.website}</a></div>` : ""}
    </div>

    ${personalInfo.summary ? `
    <div class="section">
        <h2>Professional Summary</h2>
        <p>${personalInfo.summary}</p>
    </div>
    ` : ""}

    ${experience && experience.length > 0 ? `
    <div class="section">
        <h2>Work Experience</h2>
        ${experience.map((exp: any) => `
        <div class="experience-item">
            <h3>${exp.position || "Position"}</h3>
            <div class="company">${exp.company || "Company"}</div>
            <div class="date">${exp.startDate} - ${exp.current ? "Present" : exp.endDate}</div>
            ${exp.description ? `<p>${exp.description}</p>` : ""}
        </div>
        `).join("")}
    </div>
    ` : ""}

    ${education && education.length > 0 ? `
    <div class="section">
        <h2>Education</h2>
        ${education.map((edu: any) => `
        <div class="education-item">
            <h3>${edu.degree || "Degree"} in ${edu.field || "Field"}</h3>
            <div class="institution">${edu.institution || "Institution"}</div>
            <div class="date">${edu.startDate} - ${edu.endDate}</div>
            ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ""}
        </div>
        `).join("")}
    </div>
    ` : ""}

    ${skills && skills.length > 0 ? `
    <div class="section">
        <h2>Skills</h2>
        <div class="skills">
            ${skills.map((skill: any) => `
            <span class="skill">${skill.name} (${skill.level})</span>
            `).join("")}
        </div>
    </div>
    ` : ""}
</body>
</html>
  `.trim();
}
