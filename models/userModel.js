

const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true
    },

    is_admin:{  
        type:Boolean,
        required:true
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    dateJoined:{
        type:Date,
        default:Date.now
    },
    googleId:{
        type:String
    },
    // is_verified:{
    //     type:Number,
    //     default:0
    // },
    token:{
        type:String,

    }
});


module.exports= mongoose.model("userdatas",userSchema);