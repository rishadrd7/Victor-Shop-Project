

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
        required:false
    },
    dateJoined:{
        type:Date,
        default:Date.now
    }
});


module.exports= mongoose.model("userdatas",userSchema);