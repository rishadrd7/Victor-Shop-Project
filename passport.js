
// const passport = require("passport");
// require('dotenv').config();
// const GoogleStrategy = require("passport-google-oauth20").Strategy;

// passport.serializeUser((user , done)=>{
//     done(null , user);
// })

// passport.deserializeUser((user ,done)=>{
//     done(null, user);
// })

// passport.use(new GoogleStrategy({
//     clientID:process.env.CLIEND_ID,
//     clientSecret:process.env.CLIEND_SECRET,
//     callbackURL:'http://localhost:3000/auth/google/callback',
//     passReqToCallback:true
// },
// function(req , accessToken , refreshToken, profile, done){
//     return done(null,profile)
// }

// ));