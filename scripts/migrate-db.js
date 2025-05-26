const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'lib', 'db-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Check if we have DATABASE_URL
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL environment variable is not set');
      console.log('Please set your database URL in .env.local file:');
      console.log('DATABASE_URL="your-database-connection-string"');
      process.exit(1);
    }
    
    console.log('📊 Database URL found, connecting...');
    
    // Import the database connection
    const { neon } = require('@neondatabase/serverless');
    const sql = neon(databaseUrl);
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
          await sql(statement);
        } catch (error) {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          console.log('Statement:', statement.substring(0, 100) + '...');
          // Continue with other statements
        }
      }
    }
    
    // Test the migration by checking if tables exist
    console.log('🔍 Verifying tables were created...');
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log('✅ Tables found in database:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
    // Check specifically for our main tables
    const requiredTables = ['users', 'course_bookings', 'demo_classes', 'notifications'];
    const existingTableNames = tables.map(t => t.table_name);
    
    const missingTables = requiredTables.filter(table => !existingTableNames.includes(table));
    
    if (missingTables.length === 0) {
      console.log('🎉 Migration completed successfully!');
      console.log('All required tables are now available.');
    } else {
      console.log('⚠️  Some tables are missing:', missingTables);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
