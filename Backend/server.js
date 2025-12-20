require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// 1. Connect to Database
connectDB();

// 2. Middlewares
app.use(cors()); // Allows all origins (change this for production security if needed)
app.use(express.json()); // Parses incoming JSON requests

// 3. Serve Static Files (Images)
// Uses 'path.join' for cross-platform compatibility (Windows/Linux)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 4. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/chat", chatRoutes);

// 5. Root Route (Health Check)
// Good for checking if server is live after deployment
app.get("/", (req, res) => {
  res.send("NexTrade API is running...");
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));