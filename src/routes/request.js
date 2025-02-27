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


requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res)=>{
    try {
        const loggedInUser = req.user;

        // now logic to accept the connection request
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Status not allowed!"});
        }

        // check the user in exist in our database
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id, //loggedInUser
            status: "interested"
        })
        if(!connectionRequest){
            return res.status(400).json({message: "Connection request not found"});
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({message: "Connection request" + status, data});

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})
module.exports = requestRouter;