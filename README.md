# Demo APIs - Node.js Express with Neon Postgres

A secure REST API built with Node.js, Express, and Neon PostgreSQL with JWT authentication.

## Features

✅ **Authentication** - JWT-based login & signup
✅ **Security** - Bcrypt password hashing, Helmet, CORS, Rate limiting
✅ **Postgres Database** - Neon PostgreSQL with connection pooling
✅ **Authorization** - Role-based access control (admin, user, moderator)
✅ **Error Handling** - Global error handler with custom AppError class
✅ **Input Validation** - XSS protection, parameter pollution prevention

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Neon PostgreSQL account (free tier available at neon.tech)

## Installation

### 1. Install dependencies
```bash
npm install
```

### 2. Setup Environment Variables
The `config.env` file already has the Neon Postgres connection string configured.
Update it if needed with your own credentials:

```env
NODE_ENV=development 
PORT=3000
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
```

### 3. Initialize Database
```bash
npm run init-db
```
This creates the `users` table with the required schema for authentication.

## Running the API

**Development mode (with auto-reload):**
```bash
npm start
```

The API will start on `http://localhost:3000`

**Expected output:**
```
✅ Neon Postgres connection Successful!
🚀 Application is running on port 3000
```

## API Endpoints

### Authentication (No token required)

**POST /api/v1/users/signup**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```
Response: JWT token + user data

**POST /api/v1/users/login**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response: JWT token + user data

### Protected Endpoints (Require JWT Token + Admin Role)

Add header: `Authorization: Bearer <token>`

**GET /api/v1/users** - Get all users

**GET /api/v1/users/:id** - Get user by ID

**PATCH /api/v1/users/:id** - Update user
```json
{
  "name": "Updated Name",
  "email": "new@email.com",
  "role": "admin",
  "isactive": true
}
```

**DELETE /api/v1/users/:id** - Delete user

## Testing with Postman

1. **Signup** first to get a JWT token:
   - POST http://localhost:3000/api/v1/users/signup
   - Body (JSON):
   ```json
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "password123",
     "passwordConfirm": "password123"
   }
   ```

2. **Update user role to admin** (directly in database):
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
   ```

3. **Copy the JWT token** from signup response

4. **Use in protected endpoints**:
   - Add header: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - GET http://localhost:3000/api/v1/users

## Database Schema

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
  isactive BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Project Structure

```
demo-apis/
├── controllers/
│   ├── authController.js    - Login, Signup, Auth middleware
│   ├── userController.js    - User CRUD operations
│   ├── errorController.js   - Global error handler
│   └── baseController.js    - Reusable controller functions
├── routes/
│   └── userRoutes.js        - User API routes
├── utils/
│   ├── db.js               - Database connection (Postgres)
│   ├── appError.js         - Custom error class
│   └── apiFeatures.js      - Query features
├── app.js                  - Express app setup
├── server.js               - Server entry point
├── initDb.js               - Database initialization
├── config.env              - Environment variables
├── package.json            - Dependencies
└── README.md               - Documentation
```

## Dependencies

- **express** (^4.17.1) - Web framework
- **postgres** (^3.4.8) - Neon PostgreSQL client
- **jsonwebtoken** (^8.5.1) - JWT authentication
- **bcryptjs** (^2.4.3) - Password hashing
- **dotenv** (^8.2.0) - Environment variables
- **helmet** (^3.21.2) - Security headers
- **cors** (^2.8.5) - Cross-origin requests
- **express-rate-limit** (^5.0.0) - Rate limiting
- **xss-clean** (^0.1.1) - XSS protection
- **hpp** (^0.2.2) - Parameter pollution prevention
- **validator** (^12.0.0) - Input validation
- **nodemon** (^3.1.14) - Auto-reload in development

## Error Handling

All errors return standardized JSON response:
```json
{
  "status": "fail",
  "message": "Error description"
}
```

Common errors:
- **400** - Bad Request (missing fields)
- **401** - Unauthorized (invalid credentials or token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (user/resource not found)
- **500** - Server Error

## Security Features

🔒 **Password Security** - Bcryptjs hashing with salt rounds 12
🔒 **JWT Authentication** - 30-day token expiration
🔒 **CORS** - Enabled for cross-origin requests
🔒 **Helmet** - Security headers
🔒 **Rate Limiting** - 150 requests per hour per IP
🔒 **XSS Protection** - Input sanitization
🔒 **Parameter Pollution** - Prevention enabled
🔒 **Input Validation** - Email validation

## Troubleshooting

### "Database connection failed"
- Check your DATABASE_URL in config.env
- Make sure Neon Postgres credentials are correct
- Ensure internet connection is active

### "JWT token invalid"
- Make sure token format is: `Bearer <token>`
- Check JWT_SECRET in config.env matches
- Verify token hasn't expired

### "User not found"
- Ensure user exists in database
- Check user ID format (UUID)
- Try signup first to create a user

## Author

Hiren Patel

## License

ISC
