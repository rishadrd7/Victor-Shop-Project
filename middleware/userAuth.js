const User = require('../models/userModel');

const user = async (req, res, next) => {
    
    try {

        if (!req.session.user) {

            return res.redirect('/');

        } else {

            next();

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

};

const loginTrue = async (req, res, next) => {
    
    try {
    
        if (req.session.user) {
            
            return res.redirect('/home');
        }

        next()
        
    } catch (error) {

        console.log(error.message);
        
    }

};

//  User login after blocking admin :-

const isBlocked = async (req, res, next) => {
    
    try {

        if (req.session.user) {
            // console.log('req.session',req.session.user);
            const userData = await User.findOne({ _id: req.session.user });

            if (userData.is_blocked == true) {
                
                delete req.session.user;
                return res.redirect('/login');

            } else {

                next()

            }

        } else {

            next()

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

}

module.exports = {

    user,
    loginTrue,
    isBlocked,

}