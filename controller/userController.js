
// const { ObjectId } = require("mongodb");
const User = require("../models/userModel");
const otp = require("../models/otp");
const bcrypt = require("bcrypt");
const Product = require('../models/productModel')
const nodemailer = require("nodemailer");
const passport = require('passport');
require('dotenv').config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const config = require("../config/config");
const flash= require('express-flash');


//google
const loadAuth= (req,res)=>{
  res.render('users/login')
}

const successGoogleLogin = async (req,res)=>{
  try{
    console.log(req.user);
    res.render('users/home')
    
  }catch(error){
    console.log(error);
  }
}

const failureLogin = async (req,res) =>{
  try{
    res.render("users/login")
  }catch(error){
    console.log(error);
  }
}

passport.serializeUser((user , done)=>{
  done(null , user);
})

passport.deserializeUser((user ,done)=>{
  done(null, user);
})

passport.use(new GoogleStrategy({
  clientID:process.env.CLIEND_ID,
  clientSecret:process.env.CLIEND_SECRET,
  callbackURL:'http://localhost:3000/auth/google/callback',
  passReqToCallback:true
},
function(req , accessToken , refreshToken, profile, done){
  return done(null,profile)
}

));



//facebook
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: config.facebookAuth.CliendID,
  clientSecret: config.facebookAuth.CliendSecret,
  callbackURL: config.facebookAuth.callbackURL
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));



//set bcrypt

const securedPassword = async (password) => {

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;

  } catch (error) {
    console.log(error);
  }
}


// setup homepage
const loadHome = async (req, res) => {
  try {
    
    res.render("users/homepage");

  } catch (error) {

    console.log(error);

  }
};


//set up loginpage
const loginPage = async (req, res) => {
  try {
    const message = req.flash('message');
    res.render("users/login",{message});
  } catch (error) {
    console.log(error);
  }
};


const verifyLogin = async (req, res) => { 
  try {
     const email = req.body.email;
 
     const userData = await User.findOne({ email: email });
     console.log(userData);

     if(userData.is_blocked){
       req.flash('message','account is blocked');
       return res.redirect('/login');
     }
 
     if (userData) {
       const passwordMatch = await bcrypt.compare(req.body.password, userData.password);
 
       if (passwordMatch) {
        req.session.user = userData._id;
        
         res.redirect("/home");
       } else {
         
         res.render("users/login", { message: "Incorrect password." });
       }
     } else {
      
       res.render("users/login", { message: "Email and Password incorrect." });
     }
 
  } catch (error) {
     console.log(error);
    
     res.status(500).send("Server error");
  }
 }
 

//setup registration page
const signUp = async (req, res) => {
    
  try {

      //  Flash Messgae :-

      const emailexitss = req.flash("emailexits");
      const confirmPassWrong = req.flash("confirmPassWrong");

      // const categoryData = await Category.find({ is_Listed: true });

      res.render('users/registration' , {emailAlredyExits : emailexitss , confirmPassWrongg : confirmPassWrong });
      
  } catch (error) {

      console.log(error.message);
      
  }
};


//homepage from login signup

// const logintoHome = async (req, res) => {
//   try {
//     res.render("users/homepage");
//   } catch (error) {
//     console.log(error);
//   }
// }



//forgotpassword
const forgotPass = async (req, res) => {
  try {
    res.render("users/forgotpass");
  } catch (error) {
    console.log(error);
  }
}

//resetpass
const resetPass = async (req, res) => {
  try {
    res.render("users/resetpass");
  } catch (error) {
    console.log(error);
  }
}

//verify user
const insertUser = async (req, res) => {
    
  try {

      const emailExists = await User.findOne({ email: req.body.email });

      if (emailExists) {

          req.flash('emailexits', "Email Already Exist");
          res.redirect('/registration');
          
      } else {

          const user = new User({

              name: req.body.name,
              email: req.body.email,
              mobile: req.body.mobile,
              password: req.body.password,
              is_admin: false,
              is_blocked: false
              
          });

          //  Password and Confirm Password Checkingn :-

          const bodyNorPass = req.body.password;
          const bodyConfrimPass = req.body.confirmPassword;

          if (bodyNorPass == bodyConfrimPass) {

              req.session.userSession = user  //  Save User Data in Session

              const userData = req.session.userSession;

              if (userData) {

                  const generatedOTP = generateOTP();    //  Assign OTP to Variable

                  req.session.otp = generatedOTP;     //  Otp Saving Session 

                  console.log(generatedOTP);
  
                  await sendOTPmail(req.body.name, req.body.email, generatedOTP, res);     // Sended Otp

                  setTimeout( async () => {   //  Deleting Otp in the Dbs

                      await otp.findOneAndDelete({ emailId: req.body.email });
                      
                  }, 60000);
  
                  // res.redirect('/otpVerification');
  
              } else {
  
                  res.redirect('/registraton');
  
              };
              
          } else {

              req.flash("confirmPassWrong" , "Password Not Match...");
              res.redirect('/registration');

          }
  
      }

  } catch (error) {

      console.log(error.message);
      
  }

};


//setup otp page
const otpPage= async(req,res)=>{
  try{

    const queryEmail = req.query.email;
    const invalidOtp = req.flash('flash')

    console.log(invalidOtp);

    res.render("users/otppage" , {queryEmail ,msg:invalidOtp, otpMsg : "invalidOtp"});

  }catch(error){
    console.log(error);
  }
}


//  Function to Generator Otp :- ,
const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};


//sent otp mail
const sendOTPmail = async(name,email,sendOtp,res) => {

  try {
      
      const transporter = nodemailer.createTransport({
          service:'gmail',
          auth:{
              user:'rishadrasheed147@gmail.com'  ,
              pass: 'thtp kkww irxp cmox'
          }
      });
      

      // compose email 
      const mailOption = {
          from : 'rishadrasheed147@gmail.com',
          to:email,
          subject:'For Otp Verification',
          html :`<h3>Hello ${name},Welcome To Victor</h3> <br> <h4>Enter : ${sendOtp} on the OTP Box to register</h4>`
      }

      //send mail
      transporter.sendMail(mailOption,function(error,info){

          if(error){
              console.log('Erro sending mail :- ',error.message);
          }else{
              console.log('Email has been sended :- ',info.response);
          }
      });

      // otp schema adding 
      const userOTP = new otp({
        userEmail:email,
          otp:sendOtp,
       
      });

      await userOTP.save()

      res.redirect(`/otppage?email=${email}`)
      
      console.log('otp saved');

  } catch (error) {
      console.log(error.message);
  }
}


//verify OTP

const verifyOTP = async (req , res) => {
    
  try {

      const userSessionn = req.session.userSession;   //  Assign Session in Variable
      const getQueryEMail = req.body.email;

      const bodyOtp = req.body.inp1 + req.body.inp2 + req.body.inp3 + req.body.inp4;
          
          const verifiedOtp = await otp.findOne({ otp: bodyOtp, userEmail: getQueryEMail });

          if (verifiedOtp) {

              if (userSessionn.email == getQueryEMail) {

                  const hashPassword = await securedPassword(req.session.userSession.password);
                  
                  const userSessionData = new User({

                      name: req.session.userSession.name,
                      email: req.session.userSession.email,
                      mobile: req.session.userSession.mobile,
                      password: hashPassword,
                      is_admin: false,
                      is_blocked: false,
                      
                  });

                  userSessionData.save();
              
                  req.session.otp = undefined;    //  Deleting The otp after login user

                  req.session.user = userSessionData; //  Save User Data in Session (Orginal)

                  await User.findByIdAndUpdate({ _id: userSessionData._id }, { $set: { is_verified: true } });

                  req.flash("flash", "Verified Successfully");    //  Sweet Alert
                  res.redirect('/home');

              }
              
      } else{
        req.flash("flash", "Invalid OTP"); 
        res.redirect(`/otppage?email=${getQueryEMail}`)


      }

  } catch (error) {

      console.log(error);
      
  }

};

//resend otp
const loadResendOtp = async (req , res) => {
    
  try {

      const userdata = req.query.email;   //  Query Email

      // console.log(userdata + "hahha");

      const userSessionnn = req.session.userSession;  //  Session User Data

      if (userSessionnn.email == userdata) {
          
          const generatedotp = generateOTP();
          
          console.log(generatedotp + " Re-send Otp");

          await sendOTPmail(userSessionnn.name, userSessionnn.email, generatedotp, res);
          
          setTimeout(async () => {    //  This also Deleting the Otp in Dbs 
              
              await otp.findOneAndDelete({ userEmail: userdata });
              
          }, 60000);

      }

  } catch (error) {

      console.log(error);
      
  }

}


//setup main home
const home = async (req, res) => {
  try {
    // const userData = req.session.user
    res.render("users/home");
  } catch (error) {
    console.log(error);
  }
}

//logout button
const logoutHome = async (req, res) => {
  try {
    console.log("session d")
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    console.log(error);
  }
}

//setup shopPage
const shopPage= async(req,res)=>{
  try {
    const product = await Product.find({});
    res.render('pages/shop',{product})
  } catch (error) {
    console.log(error);
    
  }
}


//set cart
const cartPage= async (req,res)=>{
  try {
    const {id}=req.query;
    
    const pro = await Product.findOne({_id:id});
    res.render('pages/products',{pro})
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  loadAuth,
  successGoogleLogin,
  failureLogin,
  securedPassword,
  loadHome,
  loginPage,
  verifyLogin,
  // logintoHome,
  forgotPass,
  resetPass,
  signUp,
  insertUser,
  otpPage,
  verifyOTP,
  loadResendOtp,
  home,
  logoutHome,
  shopPage,
  cartPage,



};
