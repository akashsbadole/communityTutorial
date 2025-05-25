import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzleSQLite } from "drizzle-orm/better-sqlite3";
import { neon } from "@neondatabase/serverless";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { migrate as migrateSQLite } from "drizzle-orm/better-sqlite3/migrator";
import { courses, enrollments } from "../lib/schema";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

async function runMigration() {
  try {
    console.log("🔄 Starting database migration...");

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const databaseUrl = process.env.DATABASE_URL;
    const isPostgreSQL =
      databaseUrl.startsWith("postgres://") ||
      databaseUrl.startsWith("postgresql://");
    const isSQLite =
      databaseUrl.startsWith("file:") || databaseUrl.includes(".sqlite");

    console.log(
      `📡 Connecting to ${isPostgreSQL ? "PostgreSQL" : "SQLite"} database...`
    );

    let db: any;
    let sql: any;

    if (isPostgreSQL) {
      // PostgreSQL migration
      sql = neon(databaseUrl);
      db = drizzle(sql);
      console.log("🚀 Running PostgreSQL migrations...");
      await migrate(db, { migrationsFolder: "./drizzle" });
    } else if (isSQLite) {
      // SQLite migration
      const dbPath = databaseUrl.replace("file:", "");
      const dbDir = path.dirname(dbPath);

      // Ensure directory exists
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      const sqlite = new Database(dbPath);
      db = drizzleSQLite(sqlite);
      console.log("🚀 Running SQLite migrations...");
      migrateSQLite(db, { migrationsFolder: "./drizzle" });
    } else {
      throw new Error("Unsupported database URL format");
    }

    console.log("✅ Migration completed successfully!");

    // Test the connection by checking if tables exist
    console.log("🔍 Verifying tables...");

    if (isPostgreSQL) {
      const result = await sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('courses', 'enrollments', 'contacts')
      `;
      console.log(
        "📋 Found tables:",
        result.map((r: any) => r.table_name)
      );

      if (result.length === 3) {
        console.log(
          "🎉 Database setup complete! All tables created successfully."
        );
      } else {
        console.log(
          "⚠️  Some tables might be missing. Please check the migration."
        );
        console.log(`Expected 3 tables, found ${result.length}`);
      }
    } else {
      // For SQLite, just try to query the tables
      try {
        await db.select().from(courses).limit(1);
        await db.select().from(enrollments).limit(1);
        console.log(
          "🎉 Database setup complete! All tables created successfully."
        );
      } catch (error) {
        console.log(
          "⚠️  Some tables might be missing. Please check the migration."
        );
      }
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
