const express = require('express')
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/User')
const userRouter = express.Router()

//get all the pending connection req for the loggedin user

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {

    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId", "firstName lastName photoUrl");

    return res.json({
      message: "Data fetched successfully",
      data: connectionRequests
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
});


//who accepted the connecton requested
userRouter.get('/user/connections',userAuth,async(req,res)=>{
    try{
       
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id, status :"accepted"},
                {fromUserId: loggedInUser._id , status:"accepted"}
            ]
        }).populate("fromUserId", ["firstName","lastName","photoUrl","about","skills"]).
        populate("toUserId",["firstName","lastName","photoUrl","about","skills"])

        const connectionRequestsData = connectionRequests.map((row)=>{
            
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) 
            {
                return row.toUserId
            }
            return row.fromUserId
          })

          return res.json({
            data:connectionRequestsData
          })


    }catch(err)
    {
        return res.status(400).json({
            message:err.message
        })
    }
})



// feed api
userRouter.get('/feed',userAuth,async(req,res)=>{

   try{
     //get loggedin user
    const loggedInUser = req.user

    const page = parseInt(req.query.page) || 1

    const limit = parseInt(req.query.limit) || 10

    const skip = (page -1 ) * limit

    //find all the connections req send + received
    const connectionRequests = await ConnectionRequest.find({
        $or:[{ fromUserId : loggedInUser._id} , { toUserId : loggedInUser._id }]
        
    }).select("fromUserId toUserId")

    //for unique value
    const hideUsersFromFeed = new Set()

    connectionRequests.forEach((req)=> {

        hideUsersFromFeed.add(req.fromUserId.toString())

        hideUsersFromFeed.add(req.toUserId.toString())
    })


    //convert set into an array
    const users = await User.find({
        $and:[
            { _id : { $nin : Array.from(hideUsersFromFeed)}},
            { _id : { $ne : loggedInUser._id }}
        ]
    }).select( ["firstName","lastName","photoUrl","about","skills" ])
    .skip(skip).limit(limit)

    // return res
    return res.json({
        data:users
    })
     
   }catch(err)
   {
    res.status(400).json({ message: err.message})
   }

})


module.exports = userRouter