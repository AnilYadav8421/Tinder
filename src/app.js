// importing express server.
const express = require('express');
// importing mangoose databse
const connectDB = require("./config/database");  //after this you can see successfuk message in console.
// creating new appliction of express
const app = express();

// get model to store data in that.
const User = require("./models/user");

// To use middleware use [use] method.
app.use(express.json());

// Create api using POST method because it is best method.
// here we created api for signup
app.post("/signup", async (req, res) => {
    try {
        // creating user instance of the user modal.
    const user = new User(req.body);

    // Once instance is create then save it.
    await user.save();

    // After save send response otherwise it will run in loop
    res.status(201).send("User added successfully");
    } catch (err) {
        res.status(400).send(err.message);
    }
})

// To find single user from database by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const users = await User.find({ emailId: userEmail });
        if (users.length == 0) {
            res.status(404).send("User not found")
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Somthing went wrong");
    }
})


// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({}) // empty bracket means it fetch all the user from database.
        res.send(users);
    } catch (err) {
        res.status(400).send("something went wrong")
    }
})

// Delete user from database by ID.
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully")
    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// Update the user in database
app.patch("/user/:userId", async (req, res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{
        // Validating which schema should update and which not
        const ALLOWED_UPDATES = [
             "photoUrl", "about", "gender", "age", "skills"
        ];
        const isUpdateAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        // here we write two things one is user id and second the data i have to update
        const user = await User.findByIdAndUpdate({_id: userId}, data,{
            returnDocument: "after",
            runValidators: true
        })
        console.log(user);
        res.send("User updated Successfully")
    }catch (err) {
        res.status(400).send("Update failed:"+ err.message)
    }
})

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