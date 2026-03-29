const mongoose = require('mongoose')
require('dotenv').config()

const connnectdb = async()=>{
    try{

        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connected successfully")


    }catch(err)
    {
       console.log("database conncetion failed"+err)
       process.exit(1)
       
    }
}

module.exports = connnectdb