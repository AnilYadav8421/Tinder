// need mongoose so import it
const mongoose = require('mongoose');

// here creating schema
const userSchema = new mongoose.Schema({
    // here pass all the parameter that users needs
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type : String
    },
    password: {
        type: String
    },
    age:{
        type: Number
    },
    gender: {
        type: String
    }
})

// this is a mongoose model which 2 parameter firts is name of model and 2nd is schema [user, Schema]
const User = mongoose.model("User", userSchema);

// exporting User
module.exports = User;