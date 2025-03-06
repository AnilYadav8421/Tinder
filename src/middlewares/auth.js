const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Creating middleware
const userAuth = async (req, res, next) => {
    try {
        // job of this middleware is to read the request cookies
        const { token } = req.cookies;
        // if token doesnt exit throw an error
        if (!token) {
            return res.status(401).send("Login again"); //u are unauthorized
        }
        // varify it
        const decodedObj = await jwt.verify(token, "tinder@project1");
        // get my id from decodedobj
        const { _id } = decodedObj;
        // if id is present then i will find the user in database
        const user = await User.findById(_id);
        // if the user is not found then through error
        if (!user) {
            throw new Error("User not found")
        }
        req.user = user; // Attach user to request
        next();
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
}

module.exports = {
    userAuth,
};