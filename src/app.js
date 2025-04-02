require("dotenv").config(); // Load environment variables
const express = require("express"); // Import express
const connectDB = require("./config/database"); // Database connection
const cookieParser = require("cookie-parser"); // Cookie parser middleware
const cors = require("cors"); // CORS middleware

const app = express(); // Initialize express app
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET;

// Ensure JWT_SECRET is set
if (!JWT_SECRET) {
    console.error("❌ ERROR: JWT_SECRET is missing in .env file!");
    process.exit(1);
}

// ✅ Fix CORS Policy
app.use(cors({
    origin: ["https://tinder-app-frontend.onrender.com", "http://localhost:5173"],  
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // ✅ PATCH must be included
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Handle Preflight Requests for PATCH
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Enable cookie parsing

// ✅ Debug Middleware (Logs Incoming Requests & Cookies)
app.use((req, res, next) => {
    console.log(`📡 [${req.method}] ${req.path}`);
    console.log("🍪 Cookies:", req.cookies);
    next();
});

// Import Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Use Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Connect to Database & Start Server
connectDB()
    .then(() => {
        console.log("✅ Database connection established...");
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    });

// Test Route
app.get("/test", (req, res) => {
    res.send("✅ Server is working!");
});

// Admin Middleware Example
app.use("/admin", (req, res, next) => {
    console.log("🔑 Checking admin authentication...");
    const token = "xyz";
    if (token !== "xyz") {
        return res.status(401).send("❌ Unauthorized request");
    }
    next();
});

// Admin Routes
app.get("/admin/getAllData", (req, res) => {
    res.send("📂 All data sent");
});
app.get("/admin/deleteUser", (req, res) => {
    res.send("🗑 Deleted a user");
});

// User Routes Example
app.get("/user", (req, res) => {
    res.send({ firstName: "Anil", lastName: "Yadav" });
});
app.post("/user", (req, res) => {
    res.send("✅ Data successfully saved in database");
});
app.delete("/user", (req, res) => {
    res.send("✅ Data successfully deleted from database");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(500).send("❌ Something went wrong!");
});
