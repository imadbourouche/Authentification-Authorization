const http = require('http')
const app = require('./app')

const port = 8888
const server = http.createServer(app)

server.listen(port, ()=>{
    console.log(`server running on http://127.0.0.1:${port}`)
})