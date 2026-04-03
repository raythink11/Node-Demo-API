const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sql = require("../utils/db");
const AppError = require("../utils/appError");

const createToken = id => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError(400, "fail", "Please provide email and password"));
    }

    // 2) Check if user exists and password is correct
    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (!user) {
      return next(new AppError(401, "fail", "Email or password is wrong"));
    }

    // 3) Compare password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(new AppError(401, "fail", "Email or password is wrong"));
    }

    // 4) All correct, send jwt to client
    const token = createToken(user.id);

    res.status(200).json({
      status: "success",
      token,
      data: { user: { id: user.id, name: user.name, email: user.email , role: user.role} },
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // 1) Validate input
    if (!name || !email || !password || !passwordConfirm) {
      return next(new AppError(400, "fail", "Please fill all required fields"));
    }

    if (password !== passwordConfirm) {
      return next(new AppError(400, "fail", "Passwords do not match"));
    }

    // 2) Check if user already exists
    const [existingUser] = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser) {
      return next(new AppError(400, "fail", "Email already registered"));
    }

    // 3) Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4) Create user in database
    const [newUser] = await sql`
      INSERT INTO users (name, email, password, isactive, role)
      VALUES (${name}, ${email}, ${hashedPassword}, true, 'user')
      RETURNING id, name, email, role, isactive, created_at
    `;

    // 5) Create token
    const token = createToken(newUser.id);

    res.status(201).json({
      status: "success",
      token,
      data: { user: newUser },
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Check if token exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError(401, "fail", "You are not logged in! Please login to continue"));
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user exists
    const [user] = await sql`SELECT id, name, email, role, isactive FROM users WHERE id = ${decoded.id}`;
    if (!user) {
      return next(new AppError(401, "fail", "User no longer exists"));
    }

    if (!user.isactive) {
      return next(new AppError(401, "fail", "User account is inactive"));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(new AppError(401, "fail", "Invalid token"));
    }
    if (err.name === "TokenExpiredError") {
      return next(new AppError(401, "fail", "Token has expired"));
    }
    next(err);
  }
};

// Authorization check if the user has rights to do this action
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "fail", "You are not allowed to do this action"));
    }
    next();
  };
};
