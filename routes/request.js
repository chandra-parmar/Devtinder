const express = require('express')
const requestRouter = express.Router()
const {userAuth} = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/User')

//send connection request
requestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id

        const toUserId = req.params.toUserId

        const status = req.params.status

        //validation
        const allowedStatus = ["ignored","interested"]

        if(!allowedStatus.includes(status))
        {
           return res.status(400).json({
            message:"Invalid status type"
           })
        }

        //check for valid to userid
        const toUser = await User.findById(toUserId)

        if(!toUser)
        {
            return res.status(404).json({
                message:"User not found"
            })
        }

        // check there is an existing connection request or jisko send kari hai usne wapis to nahi bhej
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId, toUserId},
                {
                    fromUserId:toUserId,
                    toUserId:fromUserId
                }
            ]
        })

        if(existingConnectionRequest)
        {
            return res.status(400).json({
                message:"Connection request already exist"
            })
        }




        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status

        })

        const data = await connectionRequest.save()

        return res.json({
            message:"Connection request sent successfully",
            data
        })

    }catch(err)
    {
        throw new Error(err)
    }
})

//req review at the receiver toUser end (accepted or rejected)
requestRouter.post('/request/review/:status/:requestId',
    userAuth,
    async(req,res)=>{
    try{
         
        // logged in user (touser id)
        const loggedInUser = req.user

        const { status , requestId } = req.params

        //validation status should be accepted or rejected
        const allowedStatus = ["accepted","rejected"]

        if(!allowedStatus.includes(status))
        {
            return res.status(400).json(
                {
                    message:"Status invalid"
                }
            )
            
        }
        // request id should present in db
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : 'interested'
        })

        if(!connectionRequest)
        {
            return res.status(404).json({
                message:"Connection request not found"
            })
        }

        // update status from interested to accepteddd
        connectionRequest.status = status

        const data = await connectionRequest.save()

        return res.status(200).json({
            message: "connection request"+ status ,
            data
        })



    }catch(err)
    {
      throw new Error(err)
    }
})


module.exports = requestRouter