
//facbooklogin
const passportFacebook= require("passport-facebook");
const FacebookStrategy = require("passport-facebook").Strategy;
const config = require ("./config/config");


  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });

  passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL: config.facebookAuth.callbackURL
  }, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));
