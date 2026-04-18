const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    role : {
        type : String,
        enum : ["user", "admin"],
        default : "user"
    }   
})

const User = mongoose.model("User", userSchema)

module.exports = User   