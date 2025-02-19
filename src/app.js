// importing express server.
const express = require('express');
// importing mangoose databse
const connectDB = require("./config/database");  //after this you can see successfuk message in console.

// creating new appliction of express
const app = express();

// get model to store data in that.
const User = require("./models/user");

// import validation
const { validateSignupData } = require("./utils/validation");

// import bcrypt
const bcrypt = require("bcrypt")

// import cookies parser
const cookieParser = require("cookie-parser");

// import jsonwebtoken
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth"); //import middleware here

// To use middleware use [use] method.
app.use(express.json());

// add the cookies parser here so now you can read all cookies which is comming
app.use(cookieParser());


// Create api using POST method because it is best method.
// here we created api for signup
app.post("/signup", async (req, res) => {
    try {
        // for signup first step is validation don't let anyone signup with wrong information.
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // after all data is correct Encript the password
        // basically it encrypt using salt method
        const passwordHash = await bcrypt.hash(password, 10);

        // creating user instance of the user modal.
        const user = new User({
            firstName, lastName, emailId, password: passwordHash,
        });

        // Once instance is create then save it.
        await user.save();

        // After save send response otherwise it will run in loop
        res.status(201).send("User added successfully");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

// Lets create API for login
app.post("/login", async (req, res) => {
    try {
        // we need email and password so extract it first
        const { emailId, password } = req.body;

        // then check the user is login that is valid after that check user login data is correct
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credential")
        }


        // then check it is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {

            // Create JWT Token
            //whenever you create token you can hide some data here we will hide user id
            //_id means we hiding user id from our database || tinder@project1 is a secret key which only you and server knows and it is very important
            const token = await jwt.sign({_id: user._id}, "tinder@project1");
            console.log(token);
              

            // Add the Token to cookies and send the response back to the user
            res.cookie("token", token)
            res.send("Login Successful")
        }
        else {
            throw new Error("Invalid credential")
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

// pass the middleware userAuth in profile
app.get("/profile", userAuth, async (req, res) => {
    try{
        // validate cookies
    const cookies = req.cookies;

    // Extracting the cookies
    const {token} = cookies;

    //Varify || if the token is valid send the response back ok u can access the data otherwise your token has expired.
    // here you have to pass token which we are getting, and secret key which we have created.
    const decodedMessage = await jwt.verify(token, "tinder@project1");
    console.log(decodedMessage);
    // so now i get decoded message then store it
    const {_id} = decodedMessage;
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

// Creating API to send connection request
app.post("/sendConnectionRequest", userAuth, async (req, res)=>{
    // read who is sending connection request
    const user = req.user;
    // Sending a connection request
    console.log("Sending a connection request");
    
    res.send(user.firstName + " sent the Connection request!")
})


// // To find single user from database by email
// app.get("/user", async (req, res) => {
//     const userEmail = req.body.emailId;

//     try {
//         const users = await User.find({ emailId: userEmail });
//         if (users.length == 0) {
//             res.status(404).send("User not found")
//         } else {
//             res.send(users);
//         }
//     } catch (err) {
//         res.status(400).send("Somthing went wrong");
//     }
// })
// // Feed API - GET /feed - get all the users from the database
// app.get("/feed", async (req, res) => {
//     try {
//         const users = await User.find({}) // empty bracket means it fetch all the user from database.
//         res.send(users);
//     } catch (err) {
//         res.status(400).send("something went wrong")
//     }
// })
// // Delete user from database by ID.
// app.delete("/user", async (req, res) => {
//     const userId = req.body.userId;
//     try {
//         const user = await User.findByIdAndDelete(userId);
//         res.send("User deleted successfully")
//     } catch (err) {
//         res.status(400).send("Something went wrong")
//     }
// })
// // Update the user in database
// app.patch("/user/:userId", async (req, res) => {
//     const userId = req.params?.userId;
//     const data = req.body;
//     try {
//         // Validating which schema should update and which not
//         const ALLOWED_UPDATES = [
//             "photoUrl", "about", "gender", "age", "skills"
//         ];
//         const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
//         if (!isUpdateAllowed) {
//             throw new Error("Update not allowed");
//         }
//         // here we write two things one is user id and second the data i have to update
//         const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//             returnDocument: "after",
//             runValidators: true
//         })
//         console.log(user);
//         res.send("User updated Successfully")
//     } catch (err) {
//         res.status(400).send("Update failed:" + err.message)
//     }
// })

// here we are connecting if connection successful then we get this message in console
// connectionDB will return promise then we will see successfull and failed meassage in console.
connectDB().then(() => {
    console.log("Database connection established...");
    // calling listen method which is listining on port number(3000) [this no. will be any no. which u wan]t for anyone can connect with us.
    app.listen(3000, () => { // in 3 step we have created express sever.
        console.log("server is successfully listining on port 3000");
    })
}).catch(err => {
    console.error("Database cannot be connected");

})




// lets use user handler mathod is use as it's name indicate that is to handle user.
// req, res stand for request, response
// This will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
    res.send("testing server")
})

// Handel Auth Middleware for all GET, POST, .... all request.
app.use('/admin', (req, res, next) => {
    console.log("Admin auth is getting checked");
    const token = 'xyz';
    const isAdminAuthorized = token == 'xyz';
    if (!isAdminAuthorized) {
        res.status(401).send('Unauthorized request');
    } else {
        next();
    }
});

app.get('/admin/getAllData', (req, res) => {
    res.send("All data Sent")
});
app.get('/admin/deleteUser', (req, res) => {
    res.send("Deleted a user")
})

// This will only handle GET calls to /user
app.get("/user", (req, res) => {
    res.send({ firstName: "Anil", lastName: "Yadav" })
});

// This will only handle POST calls to /user
app.post("/user", (req, res) => {
    // Saving data to data base
    res.send("Data successfully saved in database")
})

app.delete("/user", (req, res) => {
    // deleting data to data base
    res.send("Data successfully deleted from database")
})

// To handle all the errors in express but make sure first parameter is error. 
app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("Something went wrong");
    }
})