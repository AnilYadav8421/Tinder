const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

// get all the pending connection request for the loggedin user
userRouter.get("/user/requests/recevied", userAuth, async (req, res)=>{
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate(
            "fromUserId", USER_SAFE_DATA)
        // .populate("fromUserId", ["firstName", "lastName"]);
        
        res.json({
            message:"Data fetched successfully",
            data: connectionRequests,
        })
    } catch (err) {
        req.statusCode(400).send("ERROR : " + err.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res)=>{
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            row.fromUserId;
        }) 

        res.json({data});
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})

// userRouter.get("/feed?page=1&limit=10", userAuth, async (req, res)=>{
//     try {
//         const loggedInUser = req.user;

//         const page = parseInt(req.query.page) || 1;
//         let limit = parseInt(req.query.page) || 10;
//         limit = limit>50 ? 50 : limit;

//         // calculate skip using formula
//         const skip = (page-1)+limit;

//         // Find all the connection request (sent + received)
//         const connectionRequests = await ConnectionRequest.find({
//             $or:[
//                 { fromUserId: loggedInUser._id},
//                 {toUserId: loggedInUser._id}
//             ]
//         }).select("fromUserId toUserId")


//         const hideUserFromFeed = new Set();
//         connectionRequests.forEach(req => {
//             hideUserFromFeed.add(req.fromUserId);
//             hideUserFromFeed.add(req.toUserId);
//         })

//         const users = await User.find({
//             $and:[
//                 {_id: {$nin: Array.from(hideUserFromFeed)}},
//                 {_id: {$ne: loggedInUser._id}}
//             ],
//         }).select(USER_SAFE_DATA).skip(skip).limit(limit);

//         res.send(connectionRequests)
//     } catch (err) {
//         res.status(400).json({message: err.message})
//     }
// })

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        hideUserFromFeed.add(loggedInUser._id.toString());

        const users = await User.find({
            _id: { $nin: Array.from(hideUserFromFeed) }
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching feed:", err);
        res.status(400).json({ message: err.message });
    }
});



module.exports = userRouter;