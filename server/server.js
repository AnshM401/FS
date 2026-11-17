
const dns = require("node:dns");
const http = require("http");
const { Server } = require("socket.io");

// Keep existing MongoDB DNS configuration
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server for Express and Socket.IO
const httpServer = http.createServer(app);

// Configure Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// Make Socket.IO accessible in routes
app.set("io", io);

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log(
      "User disconnected:",
      socket.id,
      "Reason:",
      reason
    );
  });
});

// Authentication API
app.use("/api/auth", authRoutes);

// Check API status
app.get("/", (req, res) => {
  res.json({
    message: "Library Management API is running!",
  });
});

// Book API routes
app.use("/api/books", bookRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      message: "Invalid JSON request body",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate book ISBN",
    });
  }

  res.status(500).json({
    message: "Internal server error",
  });
});

// Connect database before starting server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(
      `Library API running at http://localhost:${PORT}`
    );
    console.log("Socket.IO server is ready!");
  });
});
