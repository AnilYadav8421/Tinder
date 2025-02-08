// importing express server.
const express  = require('express');

// creating new appliction of express
const app = express();

// calling listen method which is listining on port number(3000) [this no. will be any no. which u wan]t for anyone can connect with us.
app.listen(3000) // in 3 step we have created express sever.

// lets use user handler mathod is use as it's name indicate that is to handle user.
// req, res stand for request, response
app.use("/hello", (req, res) => {
    res.send("hello from server") //sending response from server
})
app.use("/greet", (req, res)=>{
    res.send("Greet from server")
})
app.use("/test",(req, res)=>{
    res.send("testing server")
})
