const mongoose = require("mongoose");// import Moongoose

// create mongoose Schema.
const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId, //this an ID of user
        ref: "User", //reference to the user collection
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,  //this an ID of user
        ref: "User",
        required: true,
    },

    status: {
        type: String,
        required: true,

        // you will create enum when you need to restrict user from some value
        enum: {
            // it give preference to this values only otherwise it display message.
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
    {
        // add timestamp it display when user accect or send connection request
        timestamps: true,
    }
)

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    // check if the fromUser is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error(" - Cannot send connection request to Yourself")
    }
    next();
})

// creating modal
const ConnectionRequestModal = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema,
);

module.exports = ConnectionRequestModal;