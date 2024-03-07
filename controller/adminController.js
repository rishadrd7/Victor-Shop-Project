const User=require("../models/userModel");
const bcrypt = require('bcrypt');
require('dotenv').config();


//adminDetail
const createAdmin = async (req, res) => {
    try {

        const bodyEmail = req.body.email
        const bodyPass = req.body.password

        const adminData  = await User.findOne({email : bodyEmail , is_admin : true});

        if(adminData){

            const matchPas = await bcrypt.compare(bodyPass , adminData.password)
           
            if(matchPas){
                req.session.admin_id = adminData._id

                res.redirect('/admin/dashboard')
    
            }

        }
      
    } catch (error) {
        console.error(error);
      
    }
};


//adminlogin

const Login= async (req,res)=>{
    try{

        const msg = req.flash('flash')
        res.render("admin/adminLogin" , {msgg : msg});
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


//forgotpass
const adminForgot= async(req,res)=>{
    try{
        res.render("admin/forgotAdmin");
    }catch(error){
        console.log(error);
    }
}

//resetpass

const resetPass= async(req,res)=>{
    try{
        res.render("admin/resetpassAdmin");
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


// set usersPage
const userpage =async(req,res)=>{
    try {
        const users = await User.find({is_admin : false});
        // console.log(users,'users in dashboars'); 
        res.render('admin/adminUser',{users: users, formatDate: formatDate })
    } catch (error) {
        console.log(error);
        
    }
}

//date formate user join
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US');
    return formattedDate;
};



//admin user block and unblock
const blockUser = async (req,res) => {
    try {
      const userId = req.body.usersId
      const blockedUser = await User.findOne({_id:userId})
        blockedUser.is_blocked=!blockedUser.is_blocked;
     const g =  await blockedUser.save()
        res.send({g})
        
    } catch (error) {
      console.log(error);
      res.status("500").render('500')
    }
  }

  
  const unblockUser = async (req, res) => {
    try {
        console.log("helo");
        const userId = req.body.userId;
        console.log(userId);
        const unblockedUser = await User.findOne({ _id: userId }, { is_blocked: false }, { new: true });
        res.send(unblockedUser);
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
}


module.exports={
    createAdmin,
    Login,
    dashboard,
    adminForgot,
    resetPass,
    logout,
    userpage,
    blockUser,
    unblockUser
    
}