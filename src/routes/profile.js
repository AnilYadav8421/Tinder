const express = require('express');
const profileRouter = express.Router();
const User = require("../models/user");// get model to store data in that.
const {userAuth} = require("../middlewares/auth"); //import middleware here
const jwt = require("jsonwebtoken");// import jsonwebtoken
const { validateEditProfileData } = require('../utils/validation');




profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        // validate cookies
        const cookies = req.cookies;

        // Extracting the cookies
        const { token } = cookies;

        //Varify || if the token is valid send the response back ok u can access the data otherwise your token has expired.
        // here you have to pass token which we are getting, and secret key which we have created.
        const decodedMessage = await jwt.verify(token, "tinder@project1");
        // console.log(decodedMessage);
        // so now i get decoded message then store it
        const { _id } = decodedMessage;
        // console.log("Logged in user is :" + _id);

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Send user details
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
})

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error ("Invalid Edit Request");
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save(); // after this updated data will save in DB

        res.send("Profile Updated Successfully!!")
        
    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})
module.exports = profileRouter;