import { drizzle } from "drizzle-orm/neon-http"
import { drizzle as drizzleSQLite } from "drizzle-orm/better-sqlite3"
import { neon } from "@neondatabase/serverless"
import Database from "better-sqlite3"
import { courses } from "./schema"
import { eq } from "drizzle-orm"
import fs from "fs"
import path from "path"

// Initialize database connection with error handling
let sql: any
let db: any

try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }

  const databaseUrl = process.env.DATABASE_URL
  const isPostgreSQL = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')
  const isSQLite = databaseUrl.startsWith('file:') || databaseUrl.includes('.sqlite')

  if (process.env.NODE_ENV === 'development') {
    console.log(`[DB] Attempting to connect to ${isPostgreSQL ? 'PostgreSQL' : 'SQLite'} database...`)
  }

  if (isPostgreSQL) {
    // PostgreSQL connection
    sql = neon(databaseUrl)
    db = drizzle(sql)
  } else if (isSQLite) {
    // SQLite connection
    const dbPath = databaseUrl.replace('file:', '')
    const dbDir = path.dirname(dbPath)

    // Ensure directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }

    const sqlite = new Database(dbPath)
    db = drizzleSQLite(sqlite)
  } else {
    throw new Error("Unsupported database URL format")
  }

  if (process.env.NODE_ENV === 'development') {
    console.log("[DB] Database connection initialized successfully")
  }
} catch (error) {
  if (process.env.NODE_ENV === 'development') {
    console.warn("[DB] Database connection failed, using mock data mode")
    console.warn("[DB] Error:", error instanceof Error ? error.message : String(error))
  }
  // Create a mock db for development if connection fails
  db = null
}

export { db }

// Initialize database with sample data
export async function initializeDatabase() {
  try {
    // Skip initialization if database is not connected
    if (!db) {
      console.warn("Database not connected, skipping initialization")
      return
    }

    // Check if courses already exist
    const existingCourses = await db.select().from(courses).limit(1)

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
          description: "Master WordPress development from basics to advanced themes and plugins",
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
          description: "Build and customize Shopify stores with Liquid templates and apps",
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
          description: "Complete web development bootcamp covering HTML, CSS, JavaScript and modern frameworks",
          duration: "12 weeks",
          level: "Beginner to Advanced",
        },
      ])
    }
  } catch (error) {
    console.warn("[DB] Database initialization failed, using mock data mode")
  }
}

// Helper function to get course by slug
export async function getCourseBySlug(slug: string) {
  try {
    // If database connection failed, return JSON data for development
    if (!db) {
      console.warn(`[DB] Database not connected, using JSON data for course: ${slug}`)
      return getCourseFromJSON(slug)
    }

    const course = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1)
    return course[0] || getCourseFromJSON(slug)
  } catch (error) {
    // Only log a simplified error message to reduce console noise
    console.warn(`[DB] Database query failed for course "${slug}", using JSON data`)
    // Fallback to JSON data if database query fails
    return getCourseFromJSON(slug)
  }
}

// Helper function to get course from JSON file
function getCourseFromJSON(slug: string) {
  try {
    const coursesPath = path.join(process.cwd(), "data", "courses.json")
    if (fs.existsSync(coursesPath)) {
      const coursesData = JSON.parse(fs.readFileSync(coursesPath, "utf8"))
      const course = coursesData.courses.find((c: any) => c.slug === slug)
      return course || null
    }
  } catch (error) {
    console.warn(`[DB] Error reading JSON file, using fallback mock data`)
  }
  // Final fallback to mock data
  return getMockCourse(slug)
}

// Helper function to get all courses
export async function getAllCourses() {
  try {
    if (!db) {
      console.warn(`[DB] Database not connected, using JSON data for all courses`)
      return getAllCoursesFromJSON()
    }

    const allCourses = await db.select().from(courses)
    return allCourses.length > 0 ? allCourses : getAllCoursesFromJSON()
  } catch (error) {
    console.warn(`[DB] Database query failed for all courses, using JSON data`)
    return getAllCoursesFromJSON()
  }
}

// Helper function to get all courses from JSON
function getAllCoursesFromJSON() {
  try {
    const coursesPath = path.join(process.cwd(), "data", "courses.json")
    if (fs.existsSync(coursesPath)) {
      const coursesData = JSON.parse(fs.readFileSync(coursesPath, "utf8"))
      return coursesData.courses || []
    }
  } catch (error) {
    console.warn(`[DB] Error reading JSON file for all courses`)
  }
  return []
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
      description: "Master WordPress development from basics to advanced themes and plugins",
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
      description: "Build and customize Shopify stores with Liquid templates and apps",
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
      description: "Complete web development bootcamp covering HTML, CSS, JavaScript and modern frameworks",
      duration: "12 weeks",
      level: "Beginner to Advanced",
      createdAt: new Date(),
    },
  }

  return mockCourses[slug] || null
}
