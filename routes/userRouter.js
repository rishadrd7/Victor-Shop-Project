
const express=require("express");
const session = require("express-session");
const cookieSession = require('cookie-session');
const config = require("../config/config");
const router = express.Router();
const userController=require("../controller/userController");
const userAuth = require("../middleware/userAuth");
require('dotenv').config();
const passport = require("passport");
require('../passport');


router.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
    // cookie: { secure: true }
  })
)




//homepage
router.get("/",userController.loadHome);

//loginpage
router.get("/login",userController.loginPage);

router.post("/login",userController.verifyLogin);

//registration page
router.get("/registration",userController.signUp);

//verify user
router.post("/registration",userController.insertUser);

//home
router.get('/home',userController.home);

//logout home
router.get('/login',userController.logoutHome);

//homepage from login and signup
router.get("/homepage",userController.logintoHome);

//forgotpassword
router.get("/forgotpass",userController.forgotPass);

//resetpass
router.post("/resetpass",userController.resetPass);

//otp page
router.get("/otppage",userController.otpPage);

//verify OTP
router.post("/otpVerify",userController.verifyOTP);

//resend otp
router.get('/resendOtp', userController.loadResendOtp);

//shop Page
router.get('/shop',userController.shopPage)

//cart page
router.get('/cart',userController.cartPage);



//googlelogin

//middleware
router.use(passport.initialize());
router.use(passport.session());

//google
router.use(session({
  resave:false,
  saveUninitialized: true,
  secret: 'SECRET'
  
}));

router.get('users/login',userController.loadAuth);

// Google authentication callback route
router.get('/auth/google', 
    passport.authenticate('google', {
        scope: ['email', 'profile']
    })
);

// Google authentication route
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/success',
        failureRedirect: '/failer'
    })
);

// Success and failure routes
router.get('/success', userController.successGoogleLogin);
router.get('/failure', userController.failureLogin);




//facebook
router.get('users/login', isLoggedIn, function (req, res) {
    res.render('users/home', {
      
    });
  });
  

  router.get('users/login', isLoggedIn, function (req, res) {
    res.render('users/login');
  });
  

  router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
  }));
  

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/home',
      failureRedirect: '/login'
    }));
  
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  }



module.exports=router;