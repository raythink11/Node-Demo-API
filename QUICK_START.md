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
      "role": "admin"
    }
  }
}
```

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

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "isactive": true,
      "created_at": "2026-04-02T10:00:00+00:00"
    }
  }
}
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

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Updated Name",
      "email": "newemail@example.com",
      "role": "admin",
      "isactive": true,
      "created_at": "2026-04-02T10:00:00+00:00"
    }
  }
}
```

---

### 7. Delete User

```
DELETE http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <your_token>
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

---

## �️ Product API Endpoints

### Create Product (admin only)
```
POST http://localhost:3000/api/v1/products
Authorization: Bearer <your_admin_token>
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High performance laptop with 16GB RAM",
  "price": 999.99
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 1,
      "name": "Laptop",
      "description": "High performance laptop with 16GB RAM",
      "price": "999.99",
      "created_at": "2026-04-06T10:30:00+00:00"
    }
  }
}
```

---

### Get All Products
```
GET http://localhost:3000/api/v1/products
```

**Response:**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "products": [
      {
        "id": 2,
        "name": "Mouse",
        "description": "Wireless mouse with ergonomic design",
        "price": "29.99",
        "created_at": "2026-04-06T10:35:00+00:00"
      },
      {
        "id": 1,
        "name": "Laptop",
        "description": "High performance laptop with 16GB RAM",
        "price": "999.99",
        "created_at": "2026-04-06T10:30:00+00:00"
      }
    ]
  }
}
```

---

### Get Single Product
```
GET http://localhost:3000/api/v1/products/1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 1,
      "name": "Laptop",
      "description": "High performance laptop with 16GB RAM",
      "price": "999.99",
      "created_at": "2026-04-06T10:30:00+00:00"
    }
  }
}
```

---

### Update Product (admin only)
```
PATCH http://localhost:3000/api/v1/products/1
Authorization: Bearer <your_admin_token>
Content-Type: application/json

{
  "price": 899.99,
  "description": "Updated: High performance laptop with 32GB RAM"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 1,
      "name": "Laptop",
      "description": "Updated: High performance laptop with 32GB RAM",
      "price": "899.99",
      "created_at": "2026-04-06T10:30:00+00:00"
    }
  }
}
```

---

### Delete Product (admin only)
```
DELETE http://localhost:3000/api/v1/products/1
Authorization: Bearer <your_admin_token>
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

---

## 🧾 Order API Endpoints

### Create Order (authenticated)
```
POST http://localhost:3000/api/v1/orders
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 1,
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "productId": 1,
      "quantity": 2,
      "totalPrice": "1999.98",
      "created_at": "2026-04-06T11:00:00+00:00"
    }
  }
}
```

---

### Get My Orders (authenticated)
```
GET http://localhost:3000/api/v1/orders/my-orders
Authorization: Bearer <your_token>
```

**Response:**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "orders": [
      {
        "id": 2,
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "productId": 2,
        "quantity": 1,
        "totalPrice": "29.99",
        "created_at": "2026-04-06T11:05:00+00:00",
        "productName": "Mouse",
        "productPrice": "29.99"
      },
      {
        "id": 1,
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "productId": 1,
        "quantity": 2,
        "totalPrice": "1999.98",
        "created_at": "2026-04-06T11:00:00+00:00",
        "productName": "Laptop",
        "productPrice": "999.99"
      }
    ]
  }
}
```

---

### Get All Orders (admin only)
```
GET http://localhost:3000/api/v1/orders
Authorization: Bearer <your_admin_token>
```

**Response:**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "orders": [
      {
        "id": 2,
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "productId": 2,
        "quantity": 1,
        "totalPrice": "29.99",
        "created_at": "2026-04-06T11:05:00+00:00",
        "productName": "Mouse",
        "productPrice": "29.99",
        "userName": "Admin User",
        "userEmail": "admin@example.com"
      },
      {
        "id": 1,
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "productId": 1,
        "quantity": 2,
        "totalPrice": "1999.98",
        "created_at": "2026-04-06T11:00:00+00:00",
        "productName": "Laptop",
        "productPrice": "999.99",
        "userName": "Admin User",
        "userEmail": "admin@example.com"
      }
    ]
  }
}
```

---

### Get Single Order
```
GET http://localhost:3000/api/v1/orders/1
Authorization: Bearer <your_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 1,
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "productId": 1,
      "quantity": 2,
      "totalPrice": "1999.98",
      "created_at": "2026-04-06T11:00:00+00:00",
      "productName": "Laptop",
      "productPrice": "999.99",
      "userName": "Admin User",
      "userEmail": "admin@example.com"
    }
  }
}
```

---

### Update Order (admin only)
```
PATCH http://localhost:3000/api/v1/orders/1
Authorization: Bearer <your_admin_token>
Content-Type: application/json

{
  "quantity": 3
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 1,
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "productId": 1,
      "quantity": 3,
      "totalPrice": "2999.97",
      "created_at": "2026-04-06T11:00:00+00:00"
    }
  }
}
```

---

### Delete Order (admin only)
```
DELETE http://localhost:3000/api/v1/orders/1
Authorization: Bearer <your_admin_token>
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

---

## 🔄 Complete Workflow Example

### Step 1: Admin User - Signup
```json
POST /api/v1/users/signup
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```
**Save the token returned**: `admin_token`

### Step 2: Update Admin Role in Database
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### Step 3: Admin - Create Product
```json
POST /api/v1/products
Authorization: Bearer admin_token
{
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 999.99
}
```

### Step 4: Regular User - Signup
```json
POST /api/v1/users/signup
{
  "name": "Regular User",
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```
**Save the token returned**: `user_token`

### Step 5: Regular User - View Products
```
GET /api/v1/products
(No auth required)
```

### Step 6: Regular User - Place Order
```json
POST /api/v1/orders
Authorization: Bearer user_token
{
  "productId": 1,
  "quantity": 2
}
```

### Step 7: Regular User - View Own Orders
```
GET /api/v1/orders/my-orders
Authorization: Bearer user_token
```

### Step 8: Admin - View All Orders
```
GET /api/v1/orders
Authorization: Bearer admin_token
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

products table:
- id (SERIAL, primary key) - Unique product identifier
- name (TEXT) - Product name
- description (TEXT) - Product description
- price (NUMERIC) - Product price
- created_at (TIMESTAMP) - Product creation timestamp

orders table:
- id (SERIAL, primary key) - Unique order identifier
- user_id (UUID, foreign key) - References users.id
- product_id (INTEGER, foreign key) - References products.id
- quantity (INTEGER) - Order quantity
- total_price (NUMERIC) - Total order price
- created_at (TIMESTAMP) - Order creation timestamp
```

---

## 🎯 Complete API Summary

### User Endpoints
| Method | Endpoint | Auth? | Role | Purpose |
|--------|----------|-------|------|---------|
| POST | /api/v1/users/signup | ❌ | - | Register new user |
| POST | /api/v1/users/login | ❌ | - | Get JWT token |
| GET | /api/v1/users | ✅ | admin | List all users |
| GET | /api/v1/users/:id | ✅ | admin | Get user by ID |
| PATCH | /api/v1/users/:id | ✅ | admin | Update user |
| DELETE | /api/v1/users/:id | ✅ | admin | Delete user |

### Product Endpoints
| Method | Endpoint | Auth? | Role | Purpose |
|--------|----------|-------|------|---------|
| GET | /api/v1/products | ❌ | - | Get all products |
| GET | /api/v1/products/:id | ❌ | - | Get product by ID |
| POST | /api/v1/products | ✅ | admin | Create product |
| PATCH | /api/v1/products/:id | ✅ | admin | Update product |
| DELETE | /api/v1/products/:id | ✅ | admin | Delete product |

### Order Endpoints
| Method | Endpoint | Auth? | Role | Purpose |
|--------|----------|-------|------|---------|
| POST | /api/v1/orders | ✅ | user | Create order |
| GET | /api/v1/orders/my-orders | ✅ | user | Get my orders |
| GET | /api/v1/orders | ✅ | admin | Get all orders |
| GET | /api/v1/orders/:id | ✅ | user | Get order by ID |
| PATCH | /api/v1/orders/:id | ✅ | admin | Update order |
| DELETE | /api/v1/orders/:id | ✅ | admin | Delete order |

**✅ = Requires JWT token | 🔒 = Requires specific role**

---

## 📚 For More Information

See **README_UPDATED.md** for complete documentation
See **PROJECT_FIXES_SUMMARY.md** for detailed technical changes

Happy coding! 🚀
