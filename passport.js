//googleLogin
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user ,done)=>{
    done(null ,user);
})
passport.deserializeUser((user, done)=>{
    done(null ,user);
})


passport.use(new GoogleStrategy({
    clientID:process.env.CLIEND_ID,
    clientSecret:process.env.CLIEND_SECRET,
    callbackURL:"http://localhost:7070/auth/google/callback",
    passReqToCallback:true

},
function(request , accessToken , refreshToken , profile, done){
    return done(null,profile);
}
));


