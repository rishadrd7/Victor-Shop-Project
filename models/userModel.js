

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
        default:true
    },
    dateJoined:{
        type:Date,
        default:Date.now
    },
    // status:{
    //     type:String,
    //     enum:['active','blocked'],
    //     default:'active'
    // },
    googleId:{
        type:String
    }
});


module.exports= mongoose.model("userdatas",userSchema);