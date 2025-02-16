const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5000;

require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = process.env.MONGO_URI;
const jwt_key = process.env.JWT_SECRET_KEY;
const dbName = process.env.DB_NAME;
const collName = process.env.COLLECTION_NAME;

const client = new MongoClient(uri);
let usersCollection, activeSessions = new Map(); // Store active sessions in memory

client.connect()
  .then(() => {
    console.log("MongoDB connected");
    usersCollection = client.db(dbName).collection(collName);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("API is running...");
});

// **User Signup**
app.post("/api/users/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await usersCollection.insertOne({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// **User Login with Active Session Check**
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (activeSessions.has(user._id.toString())) {
      return res.status(403).json({ message: "User already logged in from another device" });
    }

    const token = jwt.sign({ id: user._id }, jwt_key, { expiresIn: '1h' });
    activeSessions.set(user._id.toString(), token);

    res.json({ message: "Login successful", token, user: { id: user._id, name, email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// **Logout Route**
app.post("/api/users/logout", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, jwt_key);
    activeSessions.delete(decoded.id);
    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
});

// **Middleware to check active session before accessing protected routes**
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, jwt_key);

    if (!activeSessions.has(decoded.id)) {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// **Protected Route Example**
app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "You have access to this protected route", user: req.user });
});
