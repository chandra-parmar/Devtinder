
const mongoose= require('mongoose')

const connectionRequestSchema = new mongoose.Schema({

     fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

     },
     toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
     status:{
        type:String,
        required:true,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            
        }
     }

},{
    timestamps:true
})

// compound indexing 
connectionRequestSchema.index({ fromUserId: 1 , toUserId: 1 })

//middleware
//validation cannot send connection request to ourself
connectionRequestSchema.pre('save',function(next){

    const connectionRequest = this

    //check if the fromuserid is same as touserid
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
    {
        throw new Error("Cannot send connection request to yourself")
    }

    next

})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequest