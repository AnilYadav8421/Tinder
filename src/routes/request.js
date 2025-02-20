const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth"); //import middleware here


// Creating API to send connection request
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    // read who is sending connection request
    const user = req.user;
    // Sending a connection request
    console.log("Sending a connection request");

    res.send(user.firstName + " sent the Connection request!")
})

module.exports = requestRouter;