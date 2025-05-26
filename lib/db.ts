import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzleSQLite } from "drizzle-orm/better-sqlite3";
import { neon } from "@neondatabase/serverless";
import Database from "better-sqlite3";
import {
  courses,
  enrollments,
  contacts,
  users,
  tutorProfiles,
  studentProfiles,
  courseBookings,
  demoClasses,
  notifications,
  communications,
  privacyConsents,
} from "./schema";
import { eq, desc, and } from "drizzle-orm";
import fs from "fs";
import path from "path";

// Initialize database connection with error handling
let sql: any;
let db: any;

try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const databaseUrl = process.env.DATABASE_URL;
  const isPostgreSQL =
    databaseUrl.startsWith("postgres://") ||
    databaseUrl.startsWith("postgresql://");
  const isSQLite =
    databaseUrl.startsWith("file:") || databaseUrl.includes(".sqlite");

  if (process.env.NODE_ENV === "development") {
    console.log(
      `[DB] Attempting to connect to ${
        isPostgreSQL ? "PostgreSQL" : "SQLite"
      } database...`
    );
  }

  if (isPostgreSQL) {
    // PostgreSQL connection
    sql = neon(databaseUrl);
    db = drizzle(sql);
  } else if (isSQLite) {
    // SQLite connection
    const dbPath = databaseUrl.replace("file:", "");
    const dbDir = path.dirname(dbPath);

    // Ensure directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const sqlite = new Database(dbPath);
    db = drizzleSQLite(sqlite);
  } else {
    throw new Error("Unsupported database URL format");
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[DB] Database connection initialized successfully");
  }
} catch (error) {
  if (process.env.NODE_ENV === "development") {
    console.warn("[DB] Database connection failed, using mock data mode");
    console.warn(
      "[DB] Error:",
      error instanceof Error ? error.message : String(error)
    );
  }
  // Create a mock db for development if connection fails
  db = null;
}

export { db };

// Initialize database with sample data
export async function initializeDatabase() {
  try {
    // Skip initialization if database is not connected
    if (!db) {
      console.warn("Database not connected, skipping initialization");
      return;
    }

    // Check if courses already exist
    const existingCourses = await db.select().from(courses).limit(1);

    if (existingCourses.length === 0) {
      // Insert sample courses with detailed syllabi
      await db.insert(courses).values([
        {
          name: "WordPress Course",
          slug: "wordpress",
          syllabus: JSON.stringify({
            modules: [
              {
                title: "Introduction to WordPress and Setup",
                subtopics: [
                  "What is WordPress and its history",
                  "WordPress.com vs WordPress.org",
                  "Setting up local development environment",
                  "Installing WordPress locally (XAMPP/MAMP)",
                  "WordPress file structure overview",
                  "Understanding the WordPress dashboard",
                ],
              },
              {
                title: "WordPress Themes and Customization",
                subtopics: [
                  "Understanding WordPress themes",
                  "Installing and activating themes",
                  "Theme customizer and live preview",
                  "Child themes creation and importance",
                  "Custom CSS and theme modifications",
                  "Theme hierarchy and template files",
                ],
              },
              {
                title: "Plugin Development Fundamentals",
                subtopics: [
                  "What are WordPress plugins",
                  "Plugin architecture and hooks",
                  "Creating your first plugin",
                  "Actions and filters explained",
                  "Plugin security best practices",
                  "Publishing plugins to WordPress repository",
                ],
              },
              {
                title: "Custom Post Types and Fields",
                subtopics: [
                  "Understanding post types",
                  "Creating custom post types",
                  "Custom fields and meta boxes",
                  "Advanced Custom Fields (ACF)",
                  "Custom taxonomies",
                  "Displaying custom content",
                ],
              },
              {
                title: "WordPress Security Best Practices",
                subtopics: [
                  "Common WordPress vulnerabilities",
                  "User roles and permissions",
                  "Security plugins and tools",
                  "Regular updates and maintenance",
                  "Backup strategies",
                  "SSL certificates and HTTPS",
                ],
              },
              {
                title: "Performance Optimization",
                subtopics: [
                  "WordPress performance factors",
                  "Caching strategies and plugins",
                  "Image optimization techniques",
                  "Database optimization",
                  "CDN implementation",
                  "Performance monitoring tools",
                ],
              },
              {
                title: "E-commerce with WooCommerce",
                subtopics: [
                  "WooCommerce installation and setup",
                  "Product management",
                  "Payment gateway configuration",
                  "Shipping and tax settings",
                  "WooCommerce themes and customization",
                  "Order management and reporting",
                ],
              },
              {
                title: "Deployment and Maintenance",
                subtopics: [
                  "Moving from local to live server",
                  "Domain and hosting considerations",
                  "WordPress migration tools",
                  "Regular maintenance tasks",
                  "Monitoring and analytics",
                  "Troubleshooting common issues",
                ],
              },
            ],
          }),
          tutorEmail: "wp-tutor@trainingsite.com",
          price: "$299",
          description:
            "Master WordPress development from basics to advanced themes and plugins",
          duration: "8 weeks",
          level: "Beginner to Advanced",
        },
        {
          name: "Shopify Course",
          slug: "shopify",
          syllabus: JSON.stringify({
            modules: [
              {
                title: "Shopify Platform Overview",
                subtopics: [
                  "Introduction to Shopify ecosystem",
                  "Shopify vs other e-commerce platforms",
                  "Setting up your Shopify store",
                  "Understanding Shopify admin panel",
                  "Store settings and configuration",
                  "Shopify pricing plans and features",
                ],
              },
              {
                title: "Liquid Template Language",
                subtopics: [
                  "Introduction to Liquid syntax",
                  "Variables and objects in Liquid",
                  "Liquid filters and their usage",
                  "Control flow and loops",
                  "Including and rendering templates",
                  "Liquid best practices and debugging",
                ],
              },
              {
                title: "Theme Development and Customization",
                subtopics: [
                  "Shopify theme structure",
                  "Template files and their purposes",
                  "Customizing existing themes",
                  "Creating custom sections",
                  "Theme settings and schema",
                  "Responsive design for Shopify themes",
                ],
              },
              {
                title: "Shopify Apps and Integrations",
                subtopics: [
                  "Understanding Shopify App Store",
                  "Installing and configuring apps",
                  "Popular Shopify apps overview",
                  "Custom app development basics",
                  "Shopify API introduction",
                  "Third-party integrations",
                ],
              },
              {
                title: "Payment Gateway Setup",
                subtopics: [
                  "Shopify Payments overview",
                  "Setting up payment providers",
                  "Payment security and compliance",
                  "International payment considerations",
                  "Payment testing and troubleshooting",
                  "Handling payment disputes",
                ],
              },
              {
                title: "Store Optimization and SEO",
                subtopics: [
                  "Shopify SEO fundamentals",
                  "Product and collection optimization",
                  "Site speed optimization",
                  "Mobile optimization",
                  "Analytics and tracking setup",
                  "Conversion rate optimization",
                ],
              },
            ],
          }),
          tutorEmail: "shopify-tutor@trainingsite.com",
          price: "$249",
          description:
            "Build and customize Shopify stores with Liquid templates and apps",
          duration: "6 weeks",
          level: "Intermediate",
        },
        {
          name: "Web Development Course",
          slug: "webdev",
          syllabus: JSON.stringify({
            modules: [
              {
                title: "HTML5 and Semantic Markup",
                subtopics: [
                  "HTML document structure and syntax",
                  "Semantic HTML elements",
                  "Forms and input types",
                  "HTML5 APIs and features",
                  "Accessibility best practices",
                  "HTML validation and debugging",
                ],
              },
              {
                title: "CSS3 and Responsive Design",
                subtopics: [
                  "CSS syntax and selectors",
                  "Box model and layout",
                  "Flexbox and CSS Grid",
                  "Responsive design principles",
                  "Media queries and breakpoints",
                  "CSS animations and transitions",
                ],
              },
              {
                title: "JavaScript Fundamentals",
                subtopics: [
                  "JavaScript syntax and variables",
                  "Data types and operators",
                  "Functions and scope",
                  "Objects and arrays",
                  "Control structures and loops",
                  "Error handling and debugging",
                ],
              },
              {
                title: "DOM Manipulation and Events",
                subtopics: [
                  "Understanding the DOM",
                  "Selecting and modifying elements",
                  "Event handling and listeners",
                  "Form validation with JavaScript",
                  "Dynamic content creation",
                  "Browser APIs and storage",
                ],
              },
              {
                title: "Advanced JavaScript Concepts",
                subtopics: [
                  "ES6+ features and syntax",
                  "Promises and async/await",
                  "Modules and imports",
                  "Classes and prototypes",
                  "Closures and higher-order functions",
                  "JavaScript design patterns",
                ],
              },
              {
                title: "Frontend Frameworks Introduction",
                subtopics: [
                  "Introduction to React.js",
                  "Components and JSX",
                  "State and props management",
                  "Event handling in React",
                  "React hooks basics",
                  "Building a simple React application",
                ],
              },
              {
                title: "Backend Development Basics",
                subtopics: [
                  "Introduction to Node.js",
                  "NPM and package management",
                  "Creating a simple server",
                  "Express.js framework",
                  "RESTful API design",
                  "Database integration basics",
                ],
              },
              {
                title: "Project Development and Deployment",
                subtopics: [
                  "Version control with Git",
                  "Project planning and structure",
                  "Testing and debugging strategies",
                  "Performance optimization",
                  "Deployment platforms and strategies",
                  "Portfolio development and presentation",
                ],
              },
            ],
          }),
          tutorEmail: "webdev-tutor@trainingsite.com",
          price: "$399",
          description:
            "Complete web development bootcamp covering HTML, CSS, JavaScript and modern frameworks",
          duration: "12 weeks",
          level: "Beginner to Advanced",
        },
      ]);
    }
  } catch (error) {
    console.warn("[DB] Database initialization failed, using mock data mode");
  }
}

// Helper function to get course by slug
export async function getCourseBySlug(slug: string) {
  try {
    // If database connection failed, return JSON data for development
    if (!db) {
      console.warn(
        `[DB] Database not connected, using JSON data for course: ${slug}`
      );
      return getCourseFromJSON(slug);
    }

    const course = await db
      .select()
      .from(courses)
      .where(eq(courses.slug, slug))
      .limit(1);
    return course[0] || getCourseFromJSON(slug);
  } catch (error) {
    // Only log a simplified error message to reduce console noise
    console.warn(
      `[DB] Database query failed for course "${slug}", using JSON data`
    );
    // Fallback to JSON data if database query fails
    return getCourseFromJSON(slug);
  }
}

// Helper function to get course from JSON file
function getCourseFromJSON(slug: string) {
  try {
    const coursesPath = path.join(process.cwd(), "data", "courses.json");
    if (fs.existsSync(coursesPath)) {
      const coursesData = JSON.parse(fs.readFileSync(coursesPath, "utf8"));
      const course = coursesData.courses.find((c: any) => c.slug === slug);
      return course || null;
    }
  } catch (error) {
    console.warn(`[DB] Error reading JSON file, using fallback mock data`);
  }
  // Final fallback to mock data
  return getMockCourse(slug);
}

// Helper function to get all courses
export async function getAllCourses() {
  try {
    if (!db) {
      console.warn(
        `[DB] Database not connected, using JSON data for all courses`
      );
      return getAllCoursesFromJSON();
    }

    const allCourses = await db.select().from(courses);
    return allCourses.length > 0 ? allCourses : getAllCoursesFromJSON();
  } catch (error) {
    console.warn(`[DB] Database query failed for all courses, using JSON data`);
    return getAllCoursesFromJSON();
  }
}

// Helper function to get all courses from JSON
function getAllCoursesFromJSON() {
  try {
    const coursesPath = path.join(process.cwd(), "data", "courses.json");
    if (fs.existsSync(coursesPath)) {
      const coursesData = JSON.parse(fs.readFileSync(coursesPath, "utf8"));
      return coursesData.courses || [];
    }
  } catch (error) {
    console.warn(`[DB] Error reading JSON file for all courses`);
  }
  return [];
}

// Mock data for development when database is not available
function getMockCourse(slug: string) {
  const mockCourses: Record<string, any> = {
    wordpress: {
      id: 1,
      name: "WordPress Course",
      slug: "wordpress",
      syllabus: JSON.stringify({
        modules: [
          {
            title: "Introduction to WordPress and Setup",
            subtopics: [
              "What is WordPress and its history",
              "WordPress.com vs WordPress.org",
              "Setting up local development environment",
              "Installing WordPress locally (XAMPP/MAMP)",
              "WordPress file structure overview",
              "Understanding the WordPress dashboard",
            ],
          },
          {
            title: "WordPress Themes and Customization",
            subtopics: [
              "Understanding WordPress themes",
              "Installing and activating themes",
              "Theme customizer and live preview",
              "Child themes creation and importance",
              "Custom CSS and theme modifications",
              "Theme hierarchy and template files",
            ],
          },
        ],
      }),
      tutorEmail: "wp-tutor@trainingsite.com",
      price: "$299",
      description:
        "Master WordPress development from basics to advanced themes and plugins",
      duration: "8 weeks",
      level: "Beginner to Advanced",
      createdAt: new Date(),
    },
    shopify: {
      id: 2,
      name: "Shopify Course",
      slug: "shopify",
      syllabus: JSON.stringify({
        modules: [
          {
            title: "Shopify Platform Overview",
            subtopics: [
              "Introduction to Shopify ecosystem",
              "Shopify vs other e-commerce platforms",
              "Setting up your Shopify store",
              "Understanding Shopify admin panel",
            ],
          },
        ],
      }),
      tutorEmail: "shopify-tutor@trainingsite.com",
      price: "$249",
      description:
        "Build and customize Shopify stores with Liquid templates and apps",
      duration: "6 weeks",
      level: "Intermediate",
      createdAt: new Date(),
    },
    webdev: {
      id: 3,
      name: "Web Development Course",
      slug: "webdev",
      syllabus: JSON.stringify({
        modules: [
          {
            title: "HTML5 and Semantic Markup",
            subtopics: [
              "HTML document structure and syntax",
              "Semantic HTML elements",
              "Forms and input types",
              "HTML5 APIs and features",
            ],
          },
        ],
      }),
      tutorEmail: "webdev-tutor@trainingsite.com",
      price: "$399",
      description:
        "Complete web development bootcamp covering HTML, CSS, JavaScript and modern frameworks",
      duration: "12 weeks",
      level: "Beginner to Advanced",
      createdAt: new Date(),
    },
  };

  return mockCourses[slug] || null;
}

// Course Booking System Database Functions

// User Management Functions
export async function createUser(userData: {
  clerkId: string;
  email: string;
  fullName: string;
  phone?: string;
  whatsapp?: string;
  role: "student" | "tutor" | "admin";
}) {
  try {
    if (!db) {
      console.warn("[DB] Database not connected, cannot create user");
      return null;
    }

    const userId = crypto.randomUUID();

    const result = await db
      .insert(users)
      .values({
        id: userId,
        clerkId: userData.clerkId,
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        whatsapp: userData.whatsapp,
        role: userData.role,
      })
      .returning({ id: users.id });

    return result[0]?.id || null;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    if (!db) {
      console.warn("[DB] Database not connected, cannot get user");
      return null;
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function updateUserProfile(userId: string, profileData: any) {
  try {
    if (!db) {
      console.warn("[DB] Database not connected, cannot update user profile");
      return false;
    }

    await db
      .update(users)
      .set({
        fullName: profileData.fullName,
        phone: profileData.phone,
        whatsapp: profileData.whatsapp,
        profileCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Course Booking Functions
export async function createCourseBooking(bookingData: {
  studentId: string;
  tutorId: string;
  courseId: number;
  selectedLanguage: string;
  selectedTimeSlot: string;
  totalAmount: number;
  privacyConsent: boolean;
  termsConsent: boolean;
  notes?: string;
}) {
  try {
    if (!db) {
      console.warn("[DB] Database not connected, cannot create booking");
      return null;
    }

    const bookingId = crypto.randomUUID();

    const result = await db
      .insert(courseBookings)
      .values({
        id: bookingId,
        studentId: bookingData.studentId,
        tutorId: bookingData.tutorId,
        courseId: bookingData.courseId,
        selectedLanguage: bookingData.selectedLanguage,
        selectedTimeSlot: bookingData.selectedTimeSlot,
        totalAmount: bookingData.totalAmount,
        privacyConsent: bookingData.privacyConsent,
        termsConsent: bookingData.termsConsent,
        notes: bookingData.notes,
      })
      .returning({ id: courseBookings.id });

    return result[0]?.id || null;
  } catch (error) {
    console.error("Error creating course booking:", error);
    throw error;
  }
}

// Demo Class Functions
export async function createDemoClass(demoData: {
  bookingId: string;
  studentId: string;
  tutorId: string;
  courseId: number;
  scheduledDate: Date;
  meetingLink?: string;
}) {
  try {
    if (!db) {
      console.warn("[DB] Database not connected, cannot create demo class");
      return null;
    }

    const demoId = crypto.randomUUID();

    const result = await db
      .insert(demoClasses)
      .values({
        id: demoId,
        bookingId: demoData.bookingId,
        studentId: demoData.studentId,
        tutorId: demoData.tutorId,
        courseId: demoData.courseId,
        scheduledDate: demoData.scheduledDate,
        meetingLink: demoData.meetingLink,
      })
      .returning({ id: demoClasses.id });

    return result[0]?.id || null;
  } catch (error) {
    console.error("Error creating demo class:", error);
    throw error;
  }
}

// Notification Functions
export async function createNotification(notificationData: {
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  relatedBookingId?: string;
  relatedDemoId?: string;
}) {
  try {
    if (!db) {
      console.warn("[DB] Database not connected, cannot create notification");
      return null;
    }

    const notificationId = crypto.randomUUID();

    const result = await db
      .insert(notifications)
      .values({
        id: notificationId,
        userId: notificationData.userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        actionUrl: notificationData.actionUrl,
        priority: notificationData.priority || "normal",
        relatedBookingId: notificationData.relatedBookingId,
        relatedDemoId: notificationData.relatedDemoId,
      })
      .returning({ id: notifications.id });

    return result[0]?.id || null;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

export async function getUserNotifications(userId: string, limit: number = 10) {
  try {
    if (!db) {
      console.warn("[DB] Database not connected, cannot get notifications");
      return [];
    }

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    return userNotifications;
  } catch (error) {
    console.error("Error getting user notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    if (!db) {
      console.warn(
        "[DB] Database not connected, cannot mark notification as read"
      );
      return false;
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId));

    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
}

// Student Profile Functions
export async function createStudentProfile(studentData: {
  userId: string;
  currentRole?: string;
  background?: string;
  experienceLevel: string;
  learningGoals: string[];
  timeCommitment: string;
  preferredSchedule?: string;
  selectedInterests: string[];
  specificGoals?: string;
}) {
  try {
    if (!db) {
      console.warn(
        "[DB] Database not connected, cannot create student profile"
      );
      return null;
    }

    const profileId = crypto.randomUUID();

    const result = await db
      .insert(studentProfiles)
      .values({
        id: profileId,
        userId: studentData.userId,
        currentRole: studentData.currentRole,
        background: studentData.background,
        experienceLevel: studentData.experienceLevel,
        learningGoals: JSON.stringify(studentData.learningGoals),
        timeCommitment: studentData.timeCommitment,
        preferredSchedule: studentData.preferredSchedule,
        selectedInterests: JSON.stringify(studentData.selectedInterests),
        specificGoals: studentData.specificGoals,
      })
      .returning({ id: studentProfiles.id });

    return result[0]?.id || null;
  } catch (error) {
    console.error("Error creating student profile:", error);
    throw error;
  }
}

// Tutor Profile Functions
export async function createTutorProfile(tutorData: {
  userId: string;
  bio: string;
  experience?: string;
  specializations: string[];
  languages: string[];
  timezone?: string;
}) {
  try {
    if (!db) {
      console.warn("[DB] Database not connected, cannot create tutor profile");
      return null;
    }

    const profileId = crypto.randomUUID();

    const result = await db
      .insert(tutorProfiles)
      .values({
        id: profileId,
        userId: tutorData.userId,
        bio: tutorData.bio,
        experience: tutorData.experience,
        specializations: JSON.stringify(tutorData.specializations),
        languages: JSON.stringify(tutorData.languages),
        timezone: tutorData.timezone,
      })
      .returning({ id: tutorProfiles.id });

    return result[0]?.id || null;
  } catch (error) {
    console.error("Error creating tutor profile:", error);
    throw error;
  }
}

// Get course bookings by student ID
export async function getCourseBookingsByStudentId(studentId: string) {
  try {
    if (!db) {
      console.warn("[DB] Database not connected, cannot get course bookings");
      return [];
    }

    const result = await db
      .select()
      .from(courseBookings)
      .where(eq(courseBookings.studentId, studentId))
      .orderBy(courseBookings.createdAt);

    return result;
  } catch (error) {
    console.error("Error getting course bookings by student ID:", error);
    return [];
  }
}

// Update user role
export async function updateUserRole(
  userId: string,
  newRole: "student" | "tutor" | "admin"
) {
  try {
    if (!db) {
      console.warn("[DB] Database not connected, cannot update user role");
      return false;
    }

    await db
      .update(users)
      .set({
        role: newRole,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    return false;
  }
}
