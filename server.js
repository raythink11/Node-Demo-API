const { config } = require('dotenv');
const sql = require('./utils/db');
const app = require('./app');

config({ path: './config.env' });

// For Vercel serverless deployment
module.exports = app;

// For local development
if (require.main === module) {
  const startServer = async () => {
    try {
      await sql`SELECT 1`; // Simple ping to database
      console.log('✅ Neon Postgres connection Successful!');
      
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`🚀 Application is running on port ${port}`);
      });
    } catch (err) {
      console.error('❌ Database connection failed:', err.message);
      process.exit(1);
    }
  };

  startServer();
}