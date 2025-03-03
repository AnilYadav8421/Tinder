const express = require('express');// importing express server.
// importing mangoose databse
const connectDB = require("./config/database");  //after this you can see successfuk message in console.
const app = express();// creating new appliction of express
const cookieParser = require("cookie-parser");// import cookies parser
const jwt = require("jsonwebtoken");// import jsonwebtoken
const cors = require("cors"); // import cors

// it allows the cookies to display.
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());// To use middleware use [use] method.
app.use(cookieParser());// add the cookies parser here so now you can read all cookies which is comming

//here import router to help app to know from where the routes is comming
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// here we are connecting if connection successful then we get this message in console
// connectionDB will return promise then we will see successfull and failed meassage in console.
connectDB()
    .then(() => {
        console.log("Database connection established...");
        // calling listen method which is listining on port number(3000) [this no. will be any no. which u wan]t for anyone can connect with us.
        app.listen(3000, () => { // in 3 step we have created express sever.
            console.log("server is successfully listining on port 3000");
        });
    })
    .catch(err => {
        console.error("Database cannot be connected", err);
        process.exit(1) // Exit process if DB connection fails
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