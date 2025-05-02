const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1]; // Extract token after "Bearer "
            }
        }

        if (!token) {
            return res.status(401).json({ message: "No auth token found. Please log in again." });
        }

        const decodedObj = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedObj._id);
        if (!user) {
            return res.status(401).json({ message: "❌ User not found. Unauthorized access!" });
        }
        req.user = user;
        next();
    } 
    catch (err) {
        return res.status(401).json({ message: "🚨 Unauthorized: " + err.message });
    }
};

module.exports = { userAuth };
