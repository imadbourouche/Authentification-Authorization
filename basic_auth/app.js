const express = require('express')
const morgan = require('morgan')
const path = require('path')



const app = express()
app.use(express.json())
app.use(morgan('dev'))


function basic_auth(req,res,next) {
    var auth_header = req.headers.authorization;
    console.log(req.headers);
    if(!auth_header){
        res.setHeader('WWW-Authenticate','Basic');
        res.status(401).send("authentication failed");
    }else{
        var credentials = new Buffer.from(auth_header.split(' ')[1],'base64').toString().split(':')
        var username=credentials[0];
        var password=credentials[1];
        if (username==='imad' && password=='imad'){
            next()
        }else{
            res.setHeader('WWW-Authenticate','Basic');
            res.status(401).send("authentication failed");
        }
    }
}
app.get('/logout', function (req, res) {
    
    res.status(401).send([
      'You are now logged out.',
      '<br>',
      '<a href="./">Return to the home page</a>',
    ].join(''));
  });
  
app.use(basic_auth)
app.use(express.static(path.join(__dirname,'public')))

module.exports = app