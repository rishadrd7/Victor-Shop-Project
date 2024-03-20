
const express=require("express");
const session = require("express-session");
const cookieSession = require('cookie-session');
const config = require("../config/config");
const router = express.Router();
const userController=require("../controller/userController");
const cartController=require('../controller/cartController');
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
router.get('/home',userAuth.user,userController.home);
router.post('/logout',userController.logoutHome);
router.get("/forgotpass",userController.forgotPass);
router.post('/forgotpassword',userController.forgotVerify);
router.get("/resetpass",userController.loadConfirmPassword);
router.post('/resetpassword',userController.verifyConfirmPassword);
router.get("/otppage",userAuth.loginTrue,userController.otpPage); 
router.post("/otpVerify",userController.verifyOTP);
router.get('/resendOtp', userController.loadResendOtp);


//==========================views/pages===================================================================
router.get('/shop',userAuth.user,userAuth.isBlocked,userController.shopPage);
router.get('/productDetails',userAuth.user,userAuth.isBlocked,userController.productDetails);
router.get('/profile',userAuth.user,userAuth.isBlocked,userController.userProfile);
router.post('/submit-form', userController.editProfile);
router.post('/change-password', userController.changePassword);
router.get('/profile/address' ,userAuth.user,userAuth.isBlocked,userController.addressPage);
router.post('/profile/add-address', userController.addAddress);
router.post('/delete-address',userController.deleteAddress);
router.post('/profile/edit-address', userController.editAddress);
router.get('/cartPage',userAuth.user,userAuth.isBlocked,userController.addtoCart);
router.get('/checkout',userAuth.user,userAuth.isBlocked,userController.checkoutPage);
router.post('/checkout/edit-address', userController.editCheckoutAddress);
router.post('/checkout/add-address',userController.addCheckoutAddress);
router.post('/place-order', userController.placeOrder);

router.get('/profile/myorders',userAuth.user,userAuth.isBlocked,userController.orderPage);
router.get('/wishlistPage',userAuth.user,userAuth.isBlocked,userController.wishlistPage);

//============================================cart side controller=========================================
router.post('/add-to-cart', cartController.addToCart);
router.delete('/removeProductFromCart/:cartId/:productId', cartController.removeProductFromCart);






//================================================googleLogin==============================================

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