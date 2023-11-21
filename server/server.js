import express from 'express';
import cors from 'cors';
import chat from "./controllers/chat"
require("dotenv").config();
//app
//create instance of Express
const app = express();
//add HTTP server
//create Express HTTP server
const http = require('http').createServer(app);
//socket io
const io = require('socket.io')(http,{
    path: '/socket.io',
    cors:{
        origin:['http://localhost:3000'],
        methods:["GET","POST"],
        allowedHeaders: ["content-type"]
    }
});
app.use(cors())
app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded(({extended:true})))

app.get('/api',(req,res)=>{
    res.send("THIS IS REST API");
})
chat(io);

const port = 8001

http.listen(port,()=>console.log(`Server running on port ${port}`));