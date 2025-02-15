// need mongoose so import it
const mongoose = require('mongoose');

// here creating schema
const userSchema = new mongoose.Schema({
    // here pass all the parameter that users needs
    firstName: {
        type: String,
        required: true, //required is use to do mendatory for fill that section otherwise fprm will not move forward.
        minLength: 4, // it require string atlest or more then 4 character
        maxLength: 50, // it takes less then 50 charcter
    },
    lastName: {
        type: String
    },
    emailId: {
        type : String,
        required: true,
        unique: true,  //this unique keyword protect from registering same emailId
        lowercase: true, // this will convert string to lowercase
        trim: true, // this will remove white space from string
    },
    password: {
        type: String,
        required: true,
    },
    age:{
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        // validate for gender  NOTE: this we only work on new user
        // for update change check user,js (patch) i have written code there
        validate(value){
            if (! ["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl:{
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/219/219983.png"
    },
    about:{
        type: String,
        // using default key word you can display dispription
        default: "This is default despription of user!", 
    },
    skills:{
        // here skills can be multiple so store in an array
        type: [String]
    }
},
// by default: this timestamp will added time and date of user register and updated
{
    timestamps: true,
}
);

// this is a mongoose model which 2 parameter firts is name of model and 2nd is schema [user, Schema]
const User = mongoose.model("User", userSchema);

// exporting User
module.exports = User;