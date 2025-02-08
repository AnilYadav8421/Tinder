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