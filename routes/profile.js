const express = require('express')
const profileRouter = express.Router()
const { userAuth} = require('../middlewares/auth')

//view profile
profileRouter.get('/profile/view',userAuth,async(req,res)=>{
    try{

        const user = req.user

        res.send(user)

    }catch(err){
       res.status(400).send("Error"+err.message)
    }
})

//edit profile
profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
    try{
        //allowed edit 
        const allowedEditFields =["firstName","lastName","about","skills","gender","photoUrl","age"]

        //check allowed fileds
        const isEditAllowed = Object.keys(req.body).every((field)=>
           allowedEditFields.includes(field)
        )

        if(!isEditAllowed)
        {
            throw new Erro("invalid edit request")
        }
        
        const loggedInUser = req.user

        Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]))

        await  loggedInUser.save()
        
        return res.status(200).json({
            success:true,
            message:"User updated successfully",
            data:loggedInUser
        })



    }catch(err)
    {
       res.status(400).send("Error"+ err.message)
    }
})

module.exports = profileRouter