const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        console.log("🔍 Checking authentication...");

        // ✅ Check token in cookies
        let token = req.cookies?.token;

        // ✅ If not found in cookies, check headers
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1]; // Extract token after "Bearer "
            }
        }

        // ❌ No token found
        if (!token) {
            return res.status(401).json({ message: "No auth token found. Please log in again." });
        }

        // ✅ Verify token
        const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decodedObj);

        // ✅ Find user in the database
        const user = await User.findById(decodedObj._id);
        if (!user) {
            return res.status(401).json({ message: "❌ User not found. Unauthorized access!" });
        }

        // ✅ Attach user to request
        req.user = user;
        next();
    } 
    catch (err) {
        return res.status(401).json({ message: "🚨 Unauthorized: " + err.message });
    }
};

module.exports = { userAuth };
