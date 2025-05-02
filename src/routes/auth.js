// how to create express router
const express = require('express') //import express
const authRouter = express.Router(); // Router is created
const { validateSignupData } = require("../utils/validation"); // import validation
const User = require("../models/user");// get model to store data in that.
const bcrypt = require("bcrypt")// import bcrypt
const jwt = require("jsonwebtoken");// import jsonwebtoken



// here we created api using Express router
authRouter.post("/signup", async (req, res) => {
    try {
        // for signup first step is validation don't let anyone signup with wrong information.
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // after all data is correct Encript the password
        // basically it encrypt using salt method
        const passwordHash = await bcrypt.hash(password, 10);

        // creating user instance of the user modal.
        const user = new User({
            firstName, lastName, emailId, password: passwordHash,
        });

        // Once instance is create then save it.
        const savedUser = await user.save();
        // const token = await savedUser.getJWT();
        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });


        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000)
        });

        // After save send response otherwise it will run in loop
        res.status(201).json({ message: "User added successfully", data: savedUser, token: token });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.cookie("token", token);
            res.status(200).json({
                user,
                token,
              });
               // Send user data after login
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

  

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successfull!!");
})

module.exports = authRouter; // router is exported