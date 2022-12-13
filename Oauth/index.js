const express = require('express')
const morgan=require('morgan')
const axios = require('axios')
const { token } = require('morgan')


const app=express()
const port=8888


app.use(morgan('dev'))




function getUserInfo(token) {
    const opts = { headers: { accept: 'application/json', 'Authorization': `Bearer ${token}`} };
    axios
    .get('https://api.github.com/user',opts)
    .then((res)=>{
        console.log(res.data.name);
        return res.data.name;
    })
    .catch((err)=>{
        return null
    })
}


app.get('/',async (req,res)=>{
    if (!req.query.token){
        res.status(401).send("you are not authenticated")
    }else{
        res.status(200).send(`hello in server`)        
    }
})

app.get('/login',(req,res)=>{
    res.redirect('/auth')
})


var client_id_var='76449df0c0190ec039ca'
var client_secret_var='d05500a726d394b0efeaf17214e23e431026749c'
app.get('/auth',(req,res)=>{
    res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${client_id_var}`
    );
});


app.get('/github/Oauth/callback',(req, res) => {
    console.log("callback");
    console.log(req.query.code);
    
    let body = {
        client_id:client_id_var,
        client_secret:client_secret_var,
        code: req.query.code
    }

    const opts = { headers: { accept: 'application/json' } };
    
    axios
        .post('https://github.com/login/oauth/access_token',body,opts)
        .then((github_res)=>{
            console.log(github_res.data.access_token)
            getUserInfo(github_res.data.access_token);
            res.redirect(`/?token=${github_res.data.access_token}`)
        })
        .catch((err)=>{
            res.status(500).send("server error")
        });
})

app.listen(port,()=>{
    console.log(`server running on http://127.0.0.1:${port}`)
})