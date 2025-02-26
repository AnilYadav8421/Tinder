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
        await user.save();

        // After save send response otherwise it will run in loop
        res.status(201).send("User added successfully");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        // we need email and password so extract it first
        const { emailId, password } = req.body;

        // then check the user is login that is valid after that check user login data is correct
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credential")
        }


        // then check it is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {

            // Create JWT Token
            //whenever you create token you can hide some data here we will hide user id
            //_id means we hiding user id from our database || tinder@project1 is a secret key which only you and server knows and it is very important
            const token = await jwt.sign({ _id: user._id }, "tinder@project1");
            // console.log(token);


            // Add the Token to cookies and send the response back to the user
            res.cookie("token", token)
            res.send("Login Successful")
        }
        else {
            throw new Error("Invalid credential")
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successfull!!");
})

module.exports = authRouter; // router is exported