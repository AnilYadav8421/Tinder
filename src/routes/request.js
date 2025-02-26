const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth"); //import middleware here
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');


// Creating API to send connection request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;  // fromUserId will store id of logged in user because req.user._id is a logged in user
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: " Invalid Stauts type : " + status })
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found" })
        }

        // checking is an existing connectionRequest
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        })

        if (existingConnectionRequest) {
            return res.status(400).send({ message: "Connection Request Already Exist!!" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        //save it
        const data = await connectionRequest.save();
        // send json along with message
        res.json({
            message: req.user.firstName + " is " + status + "in " + toUser.firstName,
            data,
        })

    } catch (err) {
        res.status(400).send("Error" + err.message)
    }
}
)

module.exports = requestRouter;