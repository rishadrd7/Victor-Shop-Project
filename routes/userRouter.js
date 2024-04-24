
const express=require("express");
const session = require("express-session");
const cookieSession = require('cookie-session');
const config = require("../config/config");
const router = express.Router();
const userController=require("../controller/userController");
const cartController=require('../controller/cartController');
const wishlistController=require("../controller/wishlistController");
const walletController=require('../controller/walletController');
const userAuth = require("../middleware/userAuth");
require('dotenv').config();
const passport = require("passport");
// require('../passport');


//session
router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));


//================================userController====================================================

router.get("/",userAuth.loginTrue,userController.loadHome);
router.get("/login",userController.loginPage);
router.post("/login",userController.verifyLogin);
router.get("/registration",userController.signUp);
router.post("/registration",userController.insertUser);
router.get('/home',userAuth.user,userController.home);
router.post('/logout',userController.logoutHome);
router.get('/logout',userController.logoutHome);
router.get("/forgotpass",userAuth.loginTrue,userController.forgotPass);
router.post('/forgotpassword',userController.forgotVerify);
router.get("/resetpass",userAuth.loginTrue,userController.loadConfirmPassword);
router.post('/resetpassword',userController.verifyConfirmPassword);
router.get("/otppage",userAuth.loginTrue,userController.otpPage); 
router.post("/otpVerify",userController.verifyOTP);
router.get('/resendOtp', userController.loadResendOtp);
router.get('/contact',userAuth.user,userAuth.isBlocked,userController.contactPage)
router.get('/about',userAuth.user,userAuth.isBlocked,userController.aboutPage)
// router.get('*' ,userController.pageNotFount)


//==========================views/pages===================================================================
router.get('/shop',userAuth.user,userAuth.isBlocked,userController.shopPage);
router.get('/search', userController.searchProducts);
router.get('/productDetails',userAuth.user,userAuth.isBlocked,userController.productDetails);
router.get('/profile',userAuth.user,userAuth.isBlocked,userController.userProfile);
router.post('/submit-form', userController.editProfile);
router.post('/change-password', userController.changePassword);
router.get('/profile/address' ,userAuth.user,userAuth.isBlocked,userController.addressPage);
router.post('/profile/add-address', userController.addAddress);
router.post('/delete-address',userController.deleteAddress);
router.post('/profile/edit-address', userController.editAddress);
router.get('/checkout',userAuth.user,userAuth.isBlocked,userController.checkoutPage);
router.post('/checkout/edit-address', userController.editCheckoutAddress);
router.post('/checkout/add-address',userController.addCheckoutAddress);
router.post('/place-order', userController.placeOrder);
router.post('/verify-razo',userController.verifyRazo);
router.get('/checkout/paymentFailed',userAuth.user,userAuth.isBlocked,userController.failureRazo);


router.get('/profile/myorders',userAuth.user,userAuth.isBlocked,userController.orderPage);
router.get('/profile/myorders/orderDetails/:orderId',userAuth.user,userAuth.isBlocked,userController.orderDetails);
router.post('/orders/:orderId/cancel', userController.cancelOrder);
router.post('/profile/myorders/returnOrder', userController.returnOrder);
router.get('/profile/myorders/orderDetails/invoice/:orderId',userAuth.user,userAuth.isBlocked,userController.invoicePage); 
router.post('/retryPayment',userController.retryRazo); 
router.post('/successPage',userController.updateStatus);

//============================================cart side controller=========================================
router.get('/cartPage',userAuth.user,userAuth.isBlocked,cartController.cartPage);
router.post('/add-to-cart', cartController.addToCart);
router.get('/checkStock/:productId', cartController.checkStock);
router.post('/updateCartQuantity/:productId',cartController.updateCartQuantity)
router.delete('/removeProductFromCart/:cartId/:productId', cartController.removeProductFromCart);
router.post('/cartCount', cartController.cartCount);


router.get('/couponGet',userController.getCoupon);
router.post('/applyCoupon',userController.applyCoupon);

//============================================wishlist side controller=========================================
router.get('/wishlistPage',userAuth.user,userAuth.isBlocked,wishlistController.wishlistPage);
router.post('/addToWishlist', wishlistController.addtoWishlist);
router.delete('/wishlist/remove/:productId',wishlistController.removeFromWishlist); 
router.post('/wishlistCount', wishlistController.wishlistCount);

//============================================wallet side controller=========================================
router.get('/profile/wallet',userAuth.user,walletController.walletpage);
router.post('/wallet/add-money', walletController.addMoney);
router.post('/processWalletPayment',walletController.processWalletPayment);
router.post('/processRefund',walletController.processRefund);



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