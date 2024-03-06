

const mongoose= require("mongoose");

const adminSchema= new mongoose.Schema({

    name:{type: String, required:true},
    email:{type:String, require:true, unique: true},
    password:{type: String, required:true}
});

module.exports= mongoose.model('Admin',adminSchema);

// module.exports= Admin;