const mongoose = require('mongoose')
require("dotenv").config();

mongoose.set('strictQuery', false);
const {MONGODB_URL} = process.env

exports.connect = () =>{
    console.log(MONGODB_URL)
    mongoose.connect(MONGODB_URL)
    .then(
        console.log('connected to database')
    )
    .catch((err)=>{
        console.log("error when connecting to databse")
        console.log(err)
        process.exit(1)
    })
}