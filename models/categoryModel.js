const  mongoose= require("mongoose");
 
 

 const category=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique :true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
        
    }
 })

 module.exports=mongoose.model('Category',category)