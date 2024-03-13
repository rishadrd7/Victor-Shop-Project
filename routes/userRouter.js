
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


//================================userController====================================================

router.get("/",userAuth.loginTrue,userController.loadHome);
router.get("/login",userAuth.loginTrue,userController.loginPage);
router.post("/login",userController.verifyLogin);
router.get("/registration",userAuth.loginTrue,userController.signUp);
router.post("/registration",userController.insertUser);
router.get('/home',userController.home);
router.post('/logout',userController.logoutHome);
router.get("/forgotpass",userController.forgotPass);
router.post('/forgot',userController.forgotVerify);
router.post("/resetpass",userController.resetPass);
router.get("/otppage",userAuth.loginTrue,userController.otpPage);
router.post("/otpVerify",userController.verifyOTP);
router.get('/resendOtp', userController.loadResendOtp);


//==========================views/pages===================================================================
router.get('/shop',userController.shopPage)
router.get('/productDetails',userController.productDetails);
router.get('/wishlistPage',userController.wishlistPage);
router.get('/cartPage',userController.addtoCart);
router.get('/checkout',userController.checkoutPage);
router.get('/profile',userController.userProfile);
router.get('/profile/address' ,userController.addressPage);
router.get('/profile/myorders',userController.orderPage);


//============================googleLogin==============================================

//set middleware of passport
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



//====================================facebook==============================================================
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

//===================================================================================
module.exports=router;