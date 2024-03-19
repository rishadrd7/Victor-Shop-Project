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
    listed:{
        type:Boolean,
        default:false
        
    }
 })

 module.exports=mongoose.model('Category',category);