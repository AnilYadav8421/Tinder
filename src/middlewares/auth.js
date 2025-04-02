const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Creating middleware
const userAuth = async (req, res, next) => {
    try {
        console.log("Cookies received:", req.cookies);
        // job of this middleware is to read the request cookies
        const  token  = req.cookies.token;
        // if token doesnt exit throw an error
        if (!token) {
            // return res.status(401).send("Login again"); //u are unauthorized
            return res.status(401).json({ message: "No auth token found. Please log in again." });
        }
        // varify it
        const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decodedObj);

        // // get my id from decodedobj
        // const { _id } = decodedObj;
        // // if id is present then i will find the user in database
        // const user = await User.findById(_id);
        // // if the user is not found then through error
        // if (!user) {
        //     throw new Error("User not found")
        // }
        // req.user = user; // Attach user to request
        // Find user by decoded token ID
        const user = await User.findById(decodedObj._id);
        if (!user) {
            return res.status(401).json({ message: "❌ User not found. Unauthorized access!" });
        }

        req.user = user; // Attach user data to request
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "🚨 Unauthorized: " + err.message });
    }
}

module.exports = {
    userAuth,
};