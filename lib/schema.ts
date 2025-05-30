import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";

// Courses table (enhanced)
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name"),
  slug: text("slug").unique(),
  title: text("title").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  currency: text("currency").default("USD"),
  durationWeeks: integer("duration_weeks"),
  totalSessions: integer("total_sessions"),
  sessionDurationMinutes: integer("session_duration_minutes").default(60),
  category: text("category"),
  difficultyLevel: text("difficulty_level"),
  prerequisites: text("prerequisites"),
  learningOutcomes: text("learning_outcomes"),
  syllabus: text("syllabus"), // JSON string
  tutorEmail: text("tutor_email"),
  duration: text("duration"),
  level: text("level"),
  isActive: boolean("is_active").default(true),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  isSuperAdmin: boolean("is_super_admin").default(false),
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

// Course tutors junction table
export const courseTutors = pgTable("course_tutors", {
  id: text("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  tutorId: text("tutor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  isPrimary: boolean("is_primary").default(false),
  hourlyRate: real("hourly_rate"),
  availability: text("availability"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payments table
export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id")
    .notNull()
    .references(() => courseBookings.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  currency: text("currency").default("USD"),
  paymentMethod: text("payment_method").notNull(),
  paymentProvider: text("payment_provider").notNull(),
  paymentId: text("payment_id"),
  paymentStatus: text("payment_status").default("pending"),
  paymentDetails: text("payment_details"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Live sessions table
export const liveSessions = pgTable("live_sessions", {
  id: text("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  tutorId: text("tutor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  durationMinutes: integer("duration_minutes").default(60),
  meetingLink: text("meeting_link"),
  meetingPassword: text("meeting_password"),
  status: text("status").default("scheduled"), // 'scheduled', 'live', 'completed', 'cancelled'
  maxParticipants: integer("max_participants").default(50),
  recordingUrl: text("recording_url"),
  agenda: text("agenda"), // JSON string
  materials: text("materials"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session participants table
export const sessionParticipants = pgTable("session_participants", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => liveSessions.id, { onDelete: "cascade" }),
  studentId: text("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at"),
  leftAt: timestamp("left_at"),
  attendanceDuration: integer("attendance_duration"), // in minutes
  participated: boolean("participated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assignments table
export const assignments = pgTable("assignments", {
  id: text("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  tutorId: text("tutor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions"),
  dueDate: timestamp("due_date").notNull(),
  maxPoints: integer("max_points").default(100),
  submissionType: text("submission_type").default("file"), // 'file', 'text', 'url'
  allowedFileTypes: text("allowed_file_types"), // JSON array
  maxFileSize: integer("max_file_size").default(10485760), // 10MB in bytes
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assignment submissions table
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: text("id").primaryKey(),
  assignmentId: text("assignment_id")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  studentId: text("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  submissionText: text("submission_text"),
  submissionUrl: text("submission_url"),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  fileType: text("file_type"),
  status: text("status").default("submitted"), // 'draft', 'submitted', 'graded', 'returned'
  grade: integer("grade"),
  feedback: text("feedback"),
  gradedAt: timestamp("graded_at"),
  gradedBy: text("graded_by").references(() => users.id, {
    onDelete: "set null",
  }),
  submittedAt: timestamp("submitted_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support tickets table
export const supportTickets = pgTable("support_tickets", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(), // 'technical', 'billing', 'course', 'general'
  priority: text("priority").default("normal"), // 'low', 'normal', 'high', 'urgent'
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open"), // 'open', 'in_progress', 'resolved', 'closed'
  assignedTo: text("assigned_to").references(() => users.id, {
    onDelete: "set null",
  }),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support ticket messages table
export const supportTicketMessages = pgTable("support_ticket_messages", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id")
    .notNull()
    .references(() => supportTickets.id, { onDelete: "cascade" }),
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  isInternal: boolean("is_internal").default(false), // for admin/staff notes
  attachments: text("attachments"), // JSON array
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin activities table for audit logs
export const adminActivities = pgTable("admin_activities", {
  id: text("id").primaryKey(),
  adminId: text("admin_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id"),
  details: text("details"), // JSON string
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat rooms table
export const chatRooms = pgTable("chat_rooms", {
  id: text("id").primaryKey(),
  studentId: text("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tutorId: text("tutor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id").references(() => courses.id, {
    onDelete: "set null",
  }),
  isActive: boolean("is_active").default(true),
  privacyConsentStudent: boolean("privacy_consent_student").default(false),
  privacyConsentTutor: boolean("privacy_consent_tutor").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: text("id").primaryKey(),
  roomId: text("room_id")
    .notNull()
    .references(() => chatRooms.id, { onDelete: "cascade" }),
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  messageType: text("message_type").default("text"),
  fileUrl: text("file_url"),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  isRead: boolean("is_read").default(false),
  isDeleted: boolean("is_deleted").default(false),
  replyToId: text("reply_to_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SMS notifications table
export const smsNotifications = pgTable("sms_notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  phoneNumber: text("phone_number").notNull(),
  message: text("message").notNull(),
  smsType: text("sms_type").notNull(),
  sessionId: text("session_id").references(() => liveSessions.id, {
    onDelete: "set null",
  }),
  courseId: integer("course_id").references(() => courses.id, {
    onDelete: "set null",
  }),
  status: text("status").default("pending"),
  twilioSid: text("twilio_sid"),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// System settings table
export const systemSettings = pgTable("system_settings", {
  id: text("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull(),
  settingType: text("setting_type").default("string"),
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  updatedBy: text("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Resumes table
export const resumes = pgTable("resumes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  data: text("data").notNull(), // JSON string containing all resume data
  templateId: text("template_id").default("modern"),
  isPublic: boolean("is_public").default(false),
  shareToken: text("share_token").unique(), // for public sharing
  downloadCount: integer("download_count").default(0),
  lastExportedAt: timestamp("last_exported_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
