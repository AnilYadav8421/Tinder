// importing express server.
const express  = require('express');

// creating new appliction of express
const app = express();

// calling listen method which is listining on port number(3000) [this no. will be any no. which u wan]t for anyone can connect with us.
app.listen(3000) // in 3 step we have created express sever.

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