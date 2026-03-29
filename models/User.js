const mongoose= require('mongoose')
const validator= require('email-validator')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        trim:true
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true
       
    },  
    password:{
        type:String,
        require:true,
        trim:true,
        select:false,
        minLength:4
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","other"]
        }
    },
    photoUrl:{
        type:String
    },
    about:{
        type:String,
        default:"this is default about section"
    },
    skills:{
        type:[String]
    }
},{timestamps:true})

const User = mongoose.model('User', userSchema);

module.exports = User;