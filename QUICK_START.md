# Quick Start Guide

## ⚡ Get the API Running in 3 Steps

### Step 1: Install Dependencies (already done)
```bash
npm install
```

### Step 2: Initialize Database
```bash
npm run init-db
```

### Step 3: Start the Server
```bash
npm start
```

You should see:
```
✅ Neon Postgres connection Successful!
🚀 Application is running on port 3000
```

---

## 📝 Test API Endpoints

Use **Postman**, **Thunder Client**, **curl**, or any HTTP client.

### 1. Signup (Get JWT Token)

```
POST http://localhost:3000/api/v1/users/signup
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Admin User",
      "email": "admin@example.com",
      "isactive": true,
      "created_at": "2026-04-02T10:00:00+00:00"
    }
  }
}
```

✅ **Copy the token value** - you'll need it for protected routes

---

### 2. Make User an Admin (Optional - for full access)

To test protected endpoints, update the user role to 'admin':

**Using Neon Dashboard:**
1. Go to https://console.neon.tech
2. Open your database
3. Run this SQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

---

### 3. Login

```
POST http://localhost:3000/api/v1/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:** JWT token (same as signup)

---

### 4. Get All Users (Protected Route)

```
GET http://localhost:3000/api/v1/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace `eyJhbGc...` with your actual token from signup/login

**Response:**
```json
{
  "status": "success",
  "results": 1,
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin",
        "isactive": true,
        "created_at": "2026-04-02T10:00:00+00:00"
      }
    ]
  }
}
```

---

### 5. Get Single User

```
GET http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <your_token>
```

---

### 6. Update User

```
PATCH http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

---

### 7. Delete User

```
DELETE http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <your_token>
```

---

## 🔐 Important Security Notes

1. **Never share your JWT token** - It's like a password
2. **Token expires in 30 days** - Login again after expiration
3. **Keep JWT_SECRET safe** - Change it in production
4. **Only admins can access user endpoints** - Regular users can signup/login only
5. **Passwords are hashed** - Never stored in plain text

---

## 🐛 Troubleshooting

**Q: "Database connection failed"**
- A: Check your internet connection
- Make sure DATABASE_URL in config.env is correct

**Q: "Unauthorized" error**
- A: Your token might be expired or invalid
- Try logging in again with `/users/login`

**Q: "Access denied" when calling endpoints**
- A: You need admin role
- Set role = 'admin' in database for your user

**Q: "Email already registered"**
- A: That email already exists
- Try a different email address

---

## 📊 Database Schema

```sql
users table:
- id (UUID, primary key) - Unique user identifier
- name (TEXT) - User's full name
- email (TEXT, UNIQUE) - User's email address
- password (TEXT) - Bcrypt hashed password
- role (TEXT) - 'admin', 'user', or 'moderator'
- isactive (BOOLEAN) - Whether account is active
- created_at (TIMESTAMP) - Account creation timestamp
```

---

## 🎯 API Summary

| Method | Endpoint | Auth? | Role | Purpose |
|--------|----------|-------|------|---------|
| POST | /api/v1/users/signup | ❌ | - | Register new user |
| POST | /api/v1/users/login | ❌ | - | Get JWT token |
| GET | /api/v1/users | ✅ | admin | List all users |
| GET | /api/v1/users/:id | ✅ | admin | Get user by ID |
| PATCH | /api/v1/users/:id | ✅ | admin | Update user |
| DELETE | /api/v1/users/:id | ✅ | admin | Delete user |

✅ = Requires JWT token
🔒 = Requires role

---

## 📚 For More Information

See **README_UPDATED.md** for complete documentation
See **PROJECT_FIXES_SUMMARY.md** for detailed technical changes

Happy coding! 🚀
