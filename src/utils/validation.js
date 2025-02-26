// THIS IS A PLACE WHERE WE WRITE ALL THE VALIDATION FOR SIGNUP AFTER THAT ONLY USER CAN SIGNUP

// import validator to check email
const validator = require("validator")

const validateSignupData = (req) => {

    // Extract data from req.body
    const { firstName, lastName, emailId, password } = req.body;

    // firts check name is exist
    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    // check the length of name
    else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("firstName should be 4-50 character");
    }
    // check email is in correct format
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
    // check password is strong otherwise throw the error
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter the strong password");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "LastName", "emailId", "photoUrl", "gender", "age", "about", "skills"]
    // loop through every keys, field
    return Object.keys(req.body).every(field => allowedEditFields.includes(field))
}



module.exports = {
    validateSignupData,
    validateEditProfileData
}