import { drizzle } from "drizzle-orm/neon-http"
import { drizzle as drizzleSQLite } from "drizzle-orm/better-sqlite3"
import { neon } from "@neondatabase/serverless"
import Database from "better-sqlite3"
import { courses } from "../lib/schema"
import * as dotenv from "dotenv"
import fs from "fs"
import path from "path"

// Load environment variables
dotenv.config()

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...")

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    const databaseUrl = process.env.DATABASE_URL
    const isPostgreSQL = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')
    const isSQLite = databaseUrl.startsWith('file:') || databaseUrl.includes('.sqlite')

    console.log(`📡 Connecting to ${isPostgreSQL ? 'PostgreSQL' : 'SQLite'} database...`)

    let db: any

    if (isPostgreSQL) {
      // PostgreSQL connection
      const sql = neon(databaseUrl)
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

    console.log("🔍 Checking for existing courses...")
    const existingCourses = await db.select().from(courses).limit(1)

    if (existingCourses.length > 0) {
      console.log("📚 Courses already exist, skipping seed...")
      return
    }

    console.log("📝 Inserting course data...")
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
              ],
            },
            {
              title: "Liquid Template Language",
              subtopics: [
                "Introduction to Liquid syntax",
                "Variables and objects in Liquid",
                "Liquid filters and their usage",
                "Control flow and loops",
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
              ],
            },
            {
              title: "CSS3 and Responsive Design",
              subtopics: [
                "CSS syntax and selectors",
                "Box model and layout",
                "Flexbox and CSS Grid",
                "Responsive design principles",
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

    console.log("✅ Database seeded successfully!")
    console.log("📊 Inserted 3 courses")

  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

seedDatabase()
