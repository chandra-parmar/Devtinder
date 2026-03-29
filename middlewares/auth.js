const jwt = require('jsonwebtoken')
const User = require('../models/User')


const userAuth = async(req,res,next)=>{

    try{

        //read the token from the req cookies
        const {token} = req.cookies

        if(!token)
        {
            throw new Error("token is not valid")
        }

        //verify token
        const decodedObj =  jwt.verify(token,"chinu@7")
        
        //extract userid from token
        const { _id } = decodedObj

        const user = await User.findById(_id)

        if(!user)
        {
            throw new Error("user not found")
        }

        //attach req with user
        req.user = user

        next()







    }catch(err)
    {
     throw new Error("Internal server error")
    }
}


module.exports ={
    userAuth
}