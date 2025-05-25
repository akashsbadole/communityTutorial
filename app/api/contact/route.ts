import { NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db";
import { contacts } from "@/lib/schema";
import { eq } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, category, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check for duplicate email in database first, then JSON fallback
    try {
      if (db) {
        const existingContact = await db
          .select()
          .from(contacts)
          .where(eq(contacts.email, email.trim()))
          .limit(1);
        if (existingContact.length > 0) {
          return NextResponse.json(
            {
              error:
                "This email has already been used to submit a contact form. Please use a different email or contact us directly.",
            },
            { status: 409 }
          );
        }
      }

      // Always check JSON file as well (for comprehensive check)
      const dataDir = path.join(process.cwd(), "data");
      const jsonPath = path.join(dataDir, "contacts.json");

      if (fs.existsSync(jsonPath)) {
        const jsonData = fs.readFileSync(jsonPath, "utf8");
        const existingContacts = JSON.parse(jsonData);
        const duplicateContact = existingContacts.find(
          (contact: any) =>
            contact.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (duplicateContact) {
          return NextResponse.json(
            {
              error:
                "This email has already been used to submit a contact form. Please use a different email or contact us directly.",
            },
            { status: 409 }
          );
        }
      }
    } catch (error) {
      console.warn("Could not check for duplicate email:", error);
    }

    // Create contact data object
    const contactData = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || "",
      category: category || "general",
      message: message.trim(),
      status: "new",
      submittedAt: new Date().toISOString(),
    };

    // Save to database if available
    let dbContactId = contactData.id;
    try {
      if (db) {
        const dbResult = await db
          .insert(contacts)
          .values({
            name: contactData.name,
            email: contactData.email,
            subject: contactData.subject,
            category: contactData.category,
            message: contactData.message,
            status: contactData.status,
          })
          .returning({ id: contacts.id });

        if (dbResult.length > 0) {
          dbContactId = dbResult[0].id;
          contactData.id = dbContactId;
        }
      }
    } catch (dbError) {
      console.warn(
        "[DB] Failed to save contact to database, using file storage only:",
        dbError
      );
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save to JSON file
    const jsonPath = path.join(dataDir, "contacts.json");
    let existingContacts: any[] = [];

    try {
      if (fs.existsSync(jsonPath)) {
        const jsonData = fs.readFileSync(jsonPath, "utf8");
        existingContacts = JSON.parse(jsonData);
      }
    } catch (error) {
      console.warn(
        "Could not read existing contacts JSON file, starting fresh"
      );
      existingContacts = [];
    }

    existingContacts.push(contactData);
    fs.writeFileSync(jsonPath, JSON.stringify(existingContacts, null, 2));

    // Save to CSV file
    const csvPath = path.join(dataDir, "contacts.csv");
    const csvHeaders =
      "ID,Name,Email,Subject,Category,Message,Status,Submitted At\n";
    const csvRow = `${contactData.id},"${contactData.name}","${
      contactData.email
    }","${contactData.subject}","${
      contactData.category
    }","${contactData.message.replace(/"/g, '""')}","${contactData.status}","${
      contactData.submittedAt
    }"\n`;

    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, csvHeaders + csvRow);
    } else {
      fs.appendFileSync(csvPath, csvRow);
    }

    // Send email notification to user
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@traininghub.com",
        to: email,
        subject: "Thank you for contacting TrainingHub",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">TrainingHub</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for reaching out!</p>
            </div>

            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-bottom: 20px;">Hi ${name},</h2>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for contacting us! We've received your message and our team will get back to you as soon as possible.
              </p>

              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                <h3 style="color: #333; margin: 0 0 10px 0;">Your Message Details:</h3>
                <p style="margin: 5px 0; color: #666;"><strong>Subject:</strong> ${
                  subject || "General Inquiry"
                }</p>
                <p style="margin: 5px 0; color: #666;"><strong>Category:</strong> ${
                  category || "General"
                }</p>
                <p style="margin: 5px 0; color: #666;"><strong>Message:</strong></p>
                <p style="margin: 10px 0; color: #666; font-style: italic;">"${message}"</p>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                We typically respond within 24 hours during business days (Monday-Friday, 8:00 AM - 6:00 PM).
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3001" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Visit Our Website
                </a>
              </div>

              <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  If you have any urgent questions, you can also reach us at:
                </p>
                <p style="color: #999; font-size: 14px; margin: 5px 0;">
                  📧 Email: ${
                    process.env.RESEND_FROM_EMAIL || "info@traininghub.com"
                  }<br>
                  📞 Phone: +1 (555) 123-4567
                </p>
              </div>
            </div>

            <div style="background: #333; padding: 20px; text-align: center;">
              <p style="color: #999; margin: 0; font-size: 14px;">
                © ${new Date().getFullYear()} TrainingHub. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send user confirmation email:", emailError);
    }

    // Send email notification to admin
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@traininghub.com",
        to: process.env.ADMIN_EMAIL || "admin@traininghub.com",
        subject: `New Contact Form Submission - ${category || "General"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc3545; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🚨 New Contact Form Submission</h1>
            </div>

            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-bottom: 20px;">Contact Details</h2>

              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Contact ID:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">${
                      contactData.id
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Name:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Email:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Subject:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">${
                      subject || "No subject"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Category:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">${
                      category || "General"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Submitted:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">${new Date(
                      contactData.submittedAt
                    ).toLocaleString()}</td>
                  </tr>
                </table>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545;">
                <h3 style="color: #333; margin: 0 0 15px 0;">Message:</h3>
                <p style="color: #666; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #666; margin: 0;">
                  Please respond to this inquiry as soon as possible.
                </p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
    }

    return NextResponse.json({
      message: "Contact form submitted successfully",
      contactId: contactData.id,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form. Please try again." },
      { status: 500 }
    );
  }
}
