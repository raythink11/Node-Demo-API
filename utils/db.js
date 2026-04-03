const postgres = require('postgres');
const { config } = require('dotenv');

config({ path: './config.env' });

// Create the connection instance
const sql = postgres(process.env.DATABASE_URL, { 
    ssl: 'require',
    connect_timeout: 10 
});

// Export the instance itself
module.exports = sql;