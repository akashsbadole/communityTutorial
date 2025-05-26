-- Course Booking System Database Schema
-- This file contains all the necessary tables for the course booking system

-- Users table (extends Clerk authentication)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'tutor', 'admin')),
    profile_completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tutor profiles
CREATE TABLE IF NOT EXISTS tutor_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    bio TEXT NOT NULL,
    experience TEXT,
    specializations TEXT, -- JSON array
    languages TEXT NOT NULL, -- JSON array
    timezone TEXT,
    rating REAL DEFAULT 0.0,
    total_students INTEGER DEFAULT 0,
    completed_courses INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Student profiles
CREATE TABLE IF NOT EXISTS student_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    current_role TEXT,
    background TEXT,
    experience_level TEXT,
    learning_goals TEXT, -- JSON array
    time_commitment TEXT,
    preferred_schedule TEXT,
    selected_interests TEXT, -- JSON array
    specific_goals TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Courses offered by tutors
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    tutor_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    price REAL NOT NULL,
    duration TEXT NOT NULL,
    max_students INTEGER DEFAULT 20,
    languages TEXT NOT NULL, -- JSON array
    syllabus TEXT, -- JSON array
    tags TEXT, -- JSON array
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Tutor availability schedules
CREATE TABLE IF NOT EXISTS tutor_availability (
    id TEXT PRIMARY KEY,
    tutor_id TEXT NOT NULL,
    course_id TEXT,
    day_of_week TEXT NOT NULL, -- Monday, Tuesday, etc.
    start_time TEXT NOT NULL, -- HH:MM format
    duration_hours INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE SET NULL
);

-- Course bookings
CREATE TABLE IF NOT EXISTS course_bookings (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    tutor_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    selected_language TEXT NOT NULL,
    selected_time_slot TEXT NOT NULL, -- day-time format
    booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    demo_scheduled BOOLEAN DEFAULT FALSE,
    demo_completed BOOLEAN DEFAULT FALSE,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    total_amount REAL NOT NULL,
    privacy_consent BOOLEAN DEFAULT FALSE,
    terms_consent BOOLEAN DEFAULT FALSE,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    demo_date DATETIME,
    course_start_date DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
);

-- Demo classes
CREATE TABLE IF NOT EXISTS demo_classes (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    tutor_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    scheduled_date DATETIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    meeting_link TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    student_attended BOOLEAN DEFAULT FALSE,
    tutor_notes TEXT,
    student_feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES course_bookings (id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- demo_scheduled, tutor_message, course_update, etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    related_booking_id TEXT,
    related_demo_id TEXT,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (related_booking_id) REFERENCES course_bookings (id) ON DELETE SET NULL,
    FOREIGN KEY (related_demo_id) REFERENCES demo_classes (id) ON DELETE SET NULL
);

-- Communication logs between tutors and students
CREATE TABLE IF NOT EXISTS communications (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('platform', 'email', 'whatsapp', 'phone')),
    subject TEXT,
    message TEXT NOT NULL,
    is_system_message BOOLEAN DEFAULT FALSE,
    is_flagged BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES course_bookings (id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Privacy consents tracking
CREATE TABLE IF NOT EXISTS privacy_consents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    consent_type TEXT NOT NULL, -- tutor_communication, data_sharing, marketing, etc.
    consent_given BOOLEAN NOT NULL,
    consent_version TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    related_booking_id TEXT,
    withdrawn_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (related_booking_id) REFERENCES course_bookings (id) ON DELETE SET NULL
);

-- Course progress tracking
CREATE TABLE IF NOT EXISTS course_progress (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0,
    progress_percentage REAL DEFAULT 0.0,
    current_module TEXT,
    last_activity_date DATETIME,
    completion_date DATETIME,
    certificate_issued BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES course_bookings (id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users (clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_course_bookings_student ON course_bookings (student_id);
CREATE INDEX IF NOT EXISTS idx_course_bookings_tutor ON course_bookings (tutor_id);
CREATE INDEX IF NOT EXISTS idx_course_bookings_status ON course_bookings (booking_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications (is_read);
CREATE INDEX IF NOT EXISTS idx_communications_booking ON communications (booking_id);
CREATE INDEX IF NOT EXISTS idx_demo_classes_date ON demo_classes (scheduled_date);
CREATE INDEX IF NOT EXISTS idx_courses_tutor ON courses (tutor_id);
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses (is_active);
