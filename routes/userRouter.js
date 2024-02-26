
const express=require("express");
const router = express.Router();
const userController=require("../controller/userController");
const passport = require("passport");
require("../passport");
const passportFacebook = require("passport-facebook");


//homepage
router.get("/",userController.loadHome);

//loginpage
router.get("/login",userController.loginPage);

router.post("/login",userController.verifyLogin);

//registration page
router.get("/registration",userController.signUp);

//verify user
router.post("/registration",userController.insertUser);

//homepage from login and signup
router.get("/homepage",userController.logintoHome);

//forgotpassword
router.get("/forgotpass",userController.forgotPass);

//resetpass
router.post("/resetpass",userController.resetPass);

//otp page
router.get("/otppage",userController.otpPage);

//verify OTP
router.post("/home",userController.verifyOTP);

//resend otp
router.get('/resendOtp', userController.loadResendOtp);

//home
router.get('/home',userController.home);

//logout home
router.get('/',userController.logoutHome);

//shop Page
router.get('/shop',userController.shopPage)

//cart page
router.get('/cart',userController.cartPage);






//googleLogin
router.use(passport.initialize());
router.use(passport.session());
router.get('/login',userController.loadAuth);

//auth
router.get("/login/google" , passport.authenticate('google', { scope:
    ['email' ,'profile']
}));

// auth callback
router.get('/login/google/callback',
    passport.authenticate('google',{
        successRedirect:'/login',
        failureRedirect:'/login'
    })
);

//success
router.get('/homepage' , userController.succeccGoogleLogin);
//failure
router.get('/login',userController.failureGoogleLogin);






//facebookLogin

router.get('/login',(req,res)=>{
    res.render("/users/login");
})

router.get('/homepage',isLoggedIn,(req,res)=>{
    res.render("users/homepage")
})


router.get('/auth/facebook',passport.authenticate('facebook',{
    scope:['public_profile', 'email']
}));


router.get('/auth/facebook/callback',function(){

    passport.authenticate('facebook',{
        successRedirect:'/homepage',
        failureRedirect:'/login'
    })
});

    function isLoggedIn(req, res, next){
        if(req.isAuthenticated())
        return next();
    res.redirect('/homepage')
    }





module.exports=router;