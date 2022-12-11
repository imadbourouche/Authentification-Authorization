
const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next)=>{
    const token = req.body.token || req.query.token || req.headers["x-access-token"]
    if(!token){
        res.status(403).json({"status":"error","message":"token required"})
    }
    try{
        const tokenDecoded =  jwt.verify(token , process.env.TOKEN_KEY);
        req.user = tokenDecoded;
    }catch(err){
        res.status(401).json({"status":"error","message":"invalid token"})
    }
    next()
}
const hello = (req,res,next)=>{
    console.log("hello")
    next()

}

exports.hello = hello;
exports.verifyToken = verifyToken;