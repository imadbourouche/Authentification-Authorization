const express=require('express')
const cookieParser=require('cookie-parser')
const morgan=require("morgan")
const uuid=require('uuid')
const e = require('express')

const app=express()
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())


class Session{
    constructor(username, expiresAt) {
        this.username = username
        this.expiresAt = expiresAt
    }

    Expired(){
        this.expiresAt <(new Date())
    }
}


var array_sessions={}


app.post('/login',(req,res)=>{
    const {username, password} = req.body;
    console.log(username, password);
    if (!username || !password){
        res.status(401).send("not authenticated");
    }else{
        if(username==="imad" && password==="pass123"){
            const sessionID = uuid.v4();
            const now=new Date();
            let expiration = new Date(+now + 120*1000);
            const userSession=new Session(username,expiration);
            array_sessions[sessionID]=userSession;
            res.status(200).cookie("sessionID",sessionID).send("hello login")
        }else{
            res.status(401).send("not authenticated");
        }
    }
})

app.get('/',(req,res)=>{
    const sessionID=req.cookies.sessionID;
    if (!sessionID){
        res.redirect('/login');
    }else{
        const session=array_sessions[sessionID];
        if (session){
            const username=session.username;
            res.status(200).send(`hello ${username}`);
        }else{
            res.status(401).send("not authenticated");
        }
    }
})

app.listen(8888)
.on('listening',()=>{
    console.log("server running on http://127.0.0.1:8888")
})
.on("error",(err)=>{
    console.log(err);
    process.exit(1);
})