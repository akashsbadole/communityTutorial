import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  syllabus: text("syllabus").notNull(),
  tutorEmail: text("tutor_email").notNull(),
  price: text("price"),
  description: text("description"),
  duration: text("duration"),
  level: text("level"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Enrollments table
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id),
  courseSlug: text("course_slug").notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Contacts table
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  category: text("category").notNull().default("general"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
