const  mongoose=require("mongoose");

const address=mongoose.Schema({
    
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },

    address:[{
        name:{
            type:String,
            required:true,
        },
        phone:{
            type:String,
            
        },
        pincode:{
            type:Number,
            required:true
        },
        place:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        locality:{
            type:String,
            required:true
        },
        status:{
            type:Boolean,
            required:true,
            default:false
         },
    }],
    
})

module.exports=mongoose.model("address",address)