import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";

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

// Users table (extends Clerk authentication)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  role: text("role").notNull(), // 'student', 'tutor', 'admin'
  profileCompleted: boolean("profile_completed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Tutor profiles
export const tutorProfiles = pgTable("tutor_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bio: text("bio").notNull(),
  experience: text("experience"),
  specializations: text("specializations"), // JSON array
  languages: text("languages").notNull(), // JSON array
  timezone: text("timezone"),
  rating: real("rating").default(0.0),
  totalStudents: integer("total_students").default(0),
  completedCourses: integer("completed_courses").default(0),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Student profiles
export const studentProfiles = pgTable("student_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  currentRole: text("current_role"),
  background: text("background"),
  experienceLevel: text("experience_level"),
  learningGoals: text("learning_goals"), // JSON array
  timeCommitment: text("time_commitment"),
  preferredSchedule: text("preferred_schedule"),
  selectedInterests: text("selected_interests"), // JSON array
  specificGoals: text("specific_goals"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Course bookings
export const courseBookings = pgTable("course_bookings", {
  id: text("id").primaryKey(),
  studentId: text("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tutorId: text("tutor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  selectedLanguage: text("selected_language").notNull(),
  selectedTimeSlot: text("selected_time_slot").notNull(),
  bookingStatus: text("booking_status").default("pending"), // 'pending', 'confirmed', 'cancelled', 'completed'
  demoScheduled: boolean("demo_scheduled").default(false),
  demoCompleted: boolean("demo_completed").default(false),
  paymentStatus: text("payment_status").default("pending"), // 'pending', 'paid', 'refunded'
  totalAmount: real("total_amount").notNull(),
  privacyConsent: boolean("privacy_consent").default(false),
  termsConsent: boolean("terms_consent").default(false),
  bookingDate: timestamp("booking_date").notNull().defaultNow(),
  demoDate: timestamp("demo_date"),
  courseStartDate: timestamp("course_start_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Demo classes
export const demoClasses = pgTable("demo_classes", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id")
    .notNull()
    .references(() => courseBookings.id, { onDelete: "cascade" }),
  studentId: text("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tutorId: text("tutor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  scheduledDate: timestamp("scheduled_date").notNull(),
  durationMinutes: integer("duration_minutes").default(60),
  meetingLink: text("meeting_link"),
  status: text("status").default("scheduled"), // 'scheduled', 'completed', 'cancelled', 'no_show'
  studentAttended: boolean("student_attended").default(false),
  tutorNotes: text("tutor_notes"),
  studentFeedback: text("student_feedback"),
  rating: integer("rating"), // 1-5 rating
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'demo_scheduled', 'tutor_message', 'course_update', etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  actionUrl: text("action_url"),
  isRead: boolean("is_read").default(false),
  priority: text("priority").default("normal"), // 'low', 'normal', 'high', 'urgent'
  relatedBookingId: text("related_booking_id").references(
    () => courseBookings.id,
    { onDelete: "set null" }
  ),
  relatedDemoId: text("related_demo_id").references(() => demoClasses.id, {
    onDelete: "set null",
  }),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Communication logs between tutors and students
export const communications = pgTable("communications", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id")
    .notNull()
    .references(() => courseBookings.id, { onDelete: "cascade" }),
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: text("receiver_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  messageType: text("message_type").notNull(), // 'platform', 'email', 'whatsapp', 'phone'
  subject: text("subject"),
  message: text("message").notNull(),
  isSystemMessage: boolean("is_system_message").default(false),
  isFlagged: boolean("is_flagged").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Privacy consents tracking
export const privacyConsents = pgTable("privacy_consents", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  consentType: text("consent_type").notNull(), // 'tutor_communication', 'data_sharing', 'marketing', etc.
  consentGiven: boolean("consent_given").notNull(),
  consentVersion: text("consent_version").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  relatedBookingId: text("related_booking_id").references(
    () => courseBookings.id,
    { onDelete: "set null" }
  ),
  withdrawnAt: timestamp("withdrawn_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
