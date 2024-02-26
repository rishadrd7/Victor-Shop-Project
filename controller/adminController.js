const User=require("../models/userModel");

//adminlogin

const Login= async (req,res)=>{
    try{
        res.render("admin/adminLogin");
    }catch(error){
        console.log(error);
    }
}

//forgotpass
const adminForgot= async(req,res)=>{
    try{
        res.render("admin/adminlogin");
    }catch(error){
        console.log(error);
    }
}

//resetpass

const resetPass= async(req,res)=>{
    try{
        res.render("admin/resetPass");
    }catch(error){
        console.log(error);
    }
}


//dashboard
const dashboard= async( req,res)=>{
    try{
        res.render("admin/dashboard");
    }catch(error){
        console.log(error);
    }
}




module.exports={
    Login,
    dashboard,
    adminForgot,
    resetPass,
    
}