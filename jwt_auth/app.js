const express = require('express')
const morgan = require('morgan');
require("dotenv").config();
require("./config/database").connect()
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const userDb=require("./model/user")
const authMiddelware = require("./middleware/auth")
const app = express()

//midellware
app.use(express.json())
app.use(morgan('dev'))

//authentification
app.post('/login',async (req,res)=>{
    let reqPassword = req.body.password
    let reqEmail= req.body.email
    if(!reqPassword|| !reqEmail ){
        res.status(400).json({"status":"error","message":"no credential found"})
    }else{
        userDb.findOne({email:reqEmail})
        .then((user)=>{
            if(!user){
                console.log(`user with email ${reqEmail} not found`)
                res.status(404).json({"status":"error","message":"user not found"})
            }else{
                bcrypt.compare(reqPassword, user.password)
                .then((result)=>{
                    if(result){
                        const userToken = jwt.sign(
                            {user_id: user._id , reqEmail},
                            process.env.TOKEN_KEY,
                            {
                                expiresIn: "2h",
                            }
                        )
                        user.token = userToken
                        res.status(200).json({"status":"success","message":user})
                    }
                })
                .catch((err)=>{
                    res.status(200).json({"status":"error","message":"error"})        
                })
            }
        })
        .catch((err)=>{
            console.log(err)
            res.status(500).json({"status":"error","message":"server error"})
        })
    }

})

app.post('/register',async (req,res)=>{
    let reqPassword = req.body.password
    let reqEmail= req.body.email
    if(!reqPassword|| !reqEmail ){
        res.status(400).json({"status":"error","message":"no credential found"})
    }else{
        try{
            const user = await userDb.findOne({email:reqEmail})
            if(user){
                res.status(400).json({"status":"error","message":"user existe"})
            }
            else{
                encryptedPassword = await bcrypt.hash(reqPassword, 10);
                const newUser = await userDb.create({
                    email: reqEmail,
                    password: encryptedPassword,
                });

                const jwtToken = jwt.sign(
                    {User_id: newUser._id,reqEmail},
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                )
                newUser.token=jwtToken

                res.status(201).json(newUser)
            }
        }catch(err){
            console.log(err)
            res.status(500).json({"status":"error","message":"server error"})
        }
    }
})



//routes
app.get("/users",authMiddelware.verifyToken,(req,res)=>{
    console.log(req.user)
    userDb.find({})
    .then((users)=>{
        res.status(200).json(users)
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({"status":"error","message":"server error"})
    })
})



module.exports = app;