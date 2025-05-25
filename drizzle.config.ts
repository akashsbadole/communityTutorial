import type { Config } from "drizzle-kit"

const databaseUrl = process.env.DATABASE_URL!

// Determine the dialect based on the DATABASE_URL
const isPostgreSQL = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')

export default {
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: isPostgreSQL ? "postgresql" : "sqlite",
  dbCredentials: isPostgreSQL
    ? { url: databaseUrl }
    : { url: databaseUrl.replace('file:', '') }
} satisfies Config
