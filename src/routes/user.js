const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest")

// get all the pending connection request for the loggedin user
userRouter.get("/user/requests/recevied", userAuth, async (req, res)=>{
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }); 
        res.json({
            message:"Data fetched successfully",
            data: connectionRequests,
        })
    } catch (err) {
        req.statusCode(400).send("ERROR : " + err.message)
    }
})

module.exports = userRouter;