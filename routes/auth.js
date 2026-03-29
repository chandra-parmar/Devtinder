const express = require('express')
const User = require('../models/User')
const validator = require('email-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const authRouter = express.Router()

//signup api
authRouter.post('/signup',async(req,res)=>{

    try{

        const {firstName,lastName,email,password} = req.body

        if(!firstName ||!lastName ||!email ||!password)
        {
            throw new Error("invalid fields")
        }

        //email validation
        if(!validator.validate(email))
        {
            throw new Error("Enter valid email")
        }

        //encrypt the password
        const passwordHash = await bcrypt.hash(password,10)




       const user = new User({
                            firstName,
                            lastName,
                            email,
                            password:passwordHash
       })

       await user.save()

       res.send("user added successfully")

    }catch(err)
    {
        res.status(400).send("error saving the user"+err.message)

    }
})



//login api
authRouter.post('/login',async(req,res)=>{

    try{
       
        const{ email ,password} = req.body
         
        //validation
        if(!email || !password)
        {
            throw new Error("missing  fields")

        }

        //email validation
        if(!validator.validate(email))
        {
            throw new Error("email id invalid")
        }

        //check for user register or not (include password explicitly, because select:false in schema)
        const user = await User.findOne({email: email}).select('+password')

        if(!user)
        {
            throw new Error("email id not present in db")
        }

        //compare password
        const isPasswordValid = await  bcrypt.compare(password, user.password)

        if(isPasswordValid)
        {
            //generate token 
            const token =  jwt.sign( {_id: user._id} , "chinu@7",{ expiresIn:"1d"}) 

            //insert token inside cookie
            const options={
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: true
            }
            
             res.cookie("token",token, options)

             res.send("login successful")


        }
        else{
            throw new Error("password not matched")
        }

       


    }catch(err)
    {
        res.status(400).send("login failed: " + err.message)
    }
})

//logout
authRouter.post('/logout',async(req,res)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now())
    })

    res.send("logout successful")
})

module.exports = authRouter