const sql = require('./utils/db');

async function init() {
  try {
    console.log('Connecting to Neon Postgres...');
    
    // Create the users table with authentication fields
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
        isactive BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    console.log('✅ Table "users" created successfully in Neon!');
    console.log('📝 You can now use the API to signup and login users');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating table:', err.message);
    process.exit(1);
  }
}

init();