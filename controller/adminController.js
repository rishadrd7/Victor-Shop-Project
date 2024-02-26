const User=require("../models/userModel");
const bcrypt = require('bcrypt');

//adminlogin

const Login= async (req,res)=>{
    try{
        res.render("admin/adminLogin");
    }catch(error){
        console.log(error);
    }
}



//verifyLogin
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });

        if (userData) {
            // console.log(password);
            console.log(email);
            const passwordMatch = await bcrypt.compare(req.body.password, userData.password);
            // console.log(passwordMatch);

            if (passwordMatch) {
                if (userData.is_admin===0) {
                } else {
                    res.render('admin/dashboard', { message: "Email and password incorrect..." });
                    
                }
            } else {
                res.render('admin/adminLogin', { message: "Password incorrect..." });
            }
        } else {
            res.render('admin/adminLogin', { message: "Email and password incorrect..." });
        }
    } catch (error) {
        console.log(error);
    }
};



//dashboard
const dashboard= async( req,res)=>{
    try{
        res.render("admin/dashboard");
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





//logout
const logout = async (req,res)=>{
    try {
        res.resnder('/admin')
    } catch (error) {
        console.log(error);
        
    }
}

module.exports={
    Login,
    verifyLogin,
    dashboard,
    adminForgot,
    resetPass,
    logout
    
}