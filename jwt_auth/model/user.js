const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
    },
    token:{
        type:String
    }

});

module.exports = mongoose.model("users",userSchema);