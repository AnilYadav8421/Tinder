// import mongoose
const mongoose = require('mongoose');

// Correct way to connect mongoose to the cluster using async & await
const connectDB = async () =>{
    mongoose.connect(
        "mongodb+srv://anilyadav8149838058:Vm5o06c77oQl5Qwv@cluster0.9vvmc.mongodb.net/Tinder" //this tender means we are connecting tinder database to out project otherwise it will cinnect cluster where may be multiple database
    );
}

// here we are exporting database
module.exports = connectDB;
