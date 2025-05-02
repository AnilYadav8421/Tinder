require("dotenv").config(); // Load environment variables
const express = require("express"); // Import express
const connectDB = require("./config/database"); // Database connection
const cookieParser = require("cookie-parser"); // Cookie parser middleware
const cors = require("cors"); // CORS middleware

const app = express(); // Initialize express app
const PORT = process.env.PORT || 3000;
// const CORS_ORIGIN = "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("❌ ERROR: JWT_SECRET is missing in .env file!");
    process.exit(1);
}

app.use(cors({
    origin: "http://localhost:5173",  // Allow requests from the frontend's port
    credentials: true,  // Allow cookies to be sent with requests
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],  // Allow necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"],  // Allow these headers
}));



app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Enable cookie parsing

app.use((req, res, next) => {
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
        app.listen(PORT, () => {
        });
    })
    .catch((err) => {
        process.exit(1);
    });
