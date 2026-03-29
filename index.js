const express = require('express')
const connectdb = require('./config/database')
const cookieParser = require('cookie-parser')
const app = express()
const port =5001





//database connectivity
connectdb()


//MIDDLEWARES
app.use(express.json())
app.use(cookieParser())


//route mounting
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')


app.use('/api/',authRouter)
app.use('/api/',profileRouter)
app.use('/api/',requestRouter)
app.use('/api/',userRouter)










app.listen(port,()=>{
    console.log("server is running at port "+port)
})