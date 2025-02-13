// importing express server.
const express  = require('express');
// importing mangoose databse
const connectDB = require("./config/database");  //after this you can see successfuk message in console.
// creating new appliction of express
const app = express();

// get model to store data in that.
const User = require("./models/user");

// Create api using POST method because it is best method.
// here we created api for signup
app.post("/signup", async (req, res)=>{
    const userObj = {
        firstName: "Virat",
        lastName: "kohli",
        emailId: "virat@kohli.com",
        password: "virat@kohli"
    }

    // creating user instance of the user modal.
    const user = new User(userObj);

    // Once instance is create then save it.
    await user.save();

    // After save send response otherwise it will run in loop
    res.send("User added successfully");
})


// here we are connecting if connection successful then we get this message in console
// connectionDB will return promise then we will see successfull and failed meassage in console.
connectDB().then(()=>{
    console.log("Database connection established...");  
    // calling listen method which is listining on port number(3000) [this no. will be any no. which u wan]t for anyone can connect with us.
    app.listen(3000, ()=>{ // in 3 step we have created express sever.
    console.log("server is successfully listining on port 3000");
})
}).catch(err =>{
    console.error("Database cannot be connected");
    
})
 



// lets use user handler mathod is use as it's name indicate that is to handle user.
// req, res stand for request, response
// This will match all the HTTP method API calls to /test
app.use("/test",(req, res)=>{
    res.send("testing server")
})

// Handel Auth Middleware for all GET, POST, .... all request.
app.use('/admin', (req, res, next) =>{
    console.log("Admin auth is getting checked");
    const token = 'xyz';
    const isAdminAuthorized = token == 'xyz';
    if (!isAdminAuthorized){
        res.status(401).send('Unauthorized request');
    } else{
        next();
    }
});

app.get('/admin/getAllData', (req, res) =>{
    res.send("All data Sent")
});
app.get('/admin/deleteUser', (req, res)=>{
    res.send("Deleted a user")
})

// This will only handle GET calls to /user
app.get("/user", (req, res)=>{
    res.send({firstName: "Anil", lastName: "Yadav"})
});

// This will only handle POST calls to /user
app.post("/user", (req, res)=>{
    // Saving data to data base
    res.send("Data successfully saved in database")
})

app.delete("/user", (req, res)=>{
    // deleting data to data base
    res.send("Data successfully deleted from database")
})

// To handle all the errors in express but make sure first parameter is error. 
app.use("/", (err, req, res, next)=>{
    if(err){
        res.status(500).send("Something went wrong");
    }
})