const express = require('express')

const app = express()


const port =5001

app.use('/',(req,res)=>{
    res.send("hello from the server")
})

app.listen(port,()=>{
    console.log("server is running at port "+port)
})