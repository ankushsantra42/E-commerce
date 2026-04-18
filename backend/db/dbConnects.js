const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongodb_uri = process.env.mongodb_uri;

const dbConnect = async() =>{
    try {
        await mongoose.connect(mongodb_uri);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbConnect;
    