
const { ObjectId } = require("mongodb");
const User = require("../models/userModel");
const otp = require("../models/otp");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const flash = require('express-flash');


//google login
const loadAuth = (req, res) => {
  res.render('users/login');
}


const succeccGoogleLogin = (req, res) => {
  if (!req.user)
    res.redirect("/homepage");
  console.log(req.user);
}

const failureGoogleLogin = (req, res) => {
  res.redirect("users/login");
}



//facebook
const loadFacebook = (req, res) => {
  res.render('users/login/callback');
}


const succeccfacebookLogin = (req, res) => {
  if (!req.user)
    res.redirect("/homepage");
  console.log(req.user);
}

const failurefacebookLogin = (req, res) => {
  res.redirect("/login");
}



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
    res.render("users/login");
  } catch (error) {
    console.log(error);
  }
};


const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;

    const userData = await User.findOne({ email: email });
    console.log(userData);

    if (userData) {
      const passwordMatch = await bcrypt.compare(req.body.password, userData.password);

      if (passwordMatch) {
        // req.session.user_id = userData._id;
        res.redirect("/home")

      }
      else {
        res.render("users/login", { message: "Incorrect password.." })
      }

    } else {
      res.render("users/login", { message: "Email and Password incorrect.." });
    }

  } catch (error) {
    console.log(error);
  }
}



//setup registration page
const signUp = async (req, res) => {
  try {

    res.render("users/registration");
  } catch (error) {
    console.log(error);
  }
};


//homepage from login signup
const logintoHome = async (req, res) => {
  try {
    res.render("users/homepage");
  } catch (error) {
    console.log(error);
  }
}

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
    const bodyEmail = req.body.email;
    const emailCheck = await User.findOne({ email: bodyEmail });

    if (emailCheck) {
      // req.flash('error', 'Email already exists. Please use a different email address.');
      res.render('users/registration', {message:  'Email already exists.    Please use a different email address..'});

    } else {
      const hashPassword = await securedPassword(req.body.password);

      // Insert user
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: hashPassword,
        is_admin: 0,
        is_blocked: false,
      });

      const userData = await user.save();

      if (userData) {
        const OTP = generateOTP();
        console.log(OTP);
        await sendOTPmail(req.body.name, req.body.email, user._id, OTP, res); // passing data as argument
      } else {
        res.redirect('/home');
      }
    }
  } catch (error) {
    console.log(error);
  }
};




//setup otp page
const otpPage = async (req, res) => {
  try {
    const id = req.query.id;
    const invalidOtp = req.flash('flash');
    // console.log(id);
    res.render("users/otppage", { id, otpMsg: invalidOtp });
  } catch (error) {
    console.log(error);
  }
};


//  Function to Generator Otp :- ,
const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};



//sent otp mail
const sendOTPmail = async (name, email, id, sendOtp, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rishadrasheed147@gmail.com11',
        pass: 'thtp kkww irxp cmox'
      }
    });
    const mailOption = {
      from: 'rishadrasheed147@gmail.com11',
      to: email,
      subject: 'For Otp Verification',
      html: `<h3>Hello ${name},Welcome To Victor</h3> <br> <h4>Enter : ${sendOtp} on the OTP Box to register</h4>`
    };
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log('Error sending mail:', error.message);
      } else {
        console.log('Email has been sent:', info.response);
      }
    });
    const userOTP = new otp({
      emailId: email,
      userId: id,
      otp: sendOtp,
    });
    await userOTP.save();

    res.redirect(`/otppage?id=${id}`);
    console.log('OTP saved');
   
  } catch (error) {
    console.log(error);
  }
};



//verify OTP

const verifyOTP = async (req, res) => {

  try {
   
    const id = new ObjectId(req.body.id)
    

    let enteredOTP = req.body.digit1 + req.body.digit2 + req.body.digit3 + req.body.digit4 + req.body.digit5 + req.body.digit6

    const verifiedOTP = await otp.findOne({ userId: id, otp: enteredOTP });


    // console.log(verifiedOTP);

    if (verifiedOTP) {


      const userData = await User.findOne({ _id: id })

      console.log(userData);

      if (userData) {

        await User.findByIdAndUpdate({ _id: userData._id }, { $set: { is_verified: true } })

        res.render('users/home')

      }

    } else {

      req.flash('flash', 'Invalid OTP...!')
      res.redirect(`/otppage?id=${id}`)

    }


  } catch (error) {
    console.log(error);

  }

}


//resend otp
const loadResendOtp = async (req, res) => {
  try {
    const userdata = req.query.id;
    console.log(userdata);
    const re_sendOtp = await User.findOne({ id: userdata });
    if (re_sendOtp) {
      const generatedotp = generateOTP();
      console.log(generatedotp + " Re-send Otp");
      await sendOTPmail(re_sendOtp.name, re_sendOtp.id, generatedotp, res);
    }
  } catch (error) {
    console.log(error);
  }
}



//setup main home
const home = async (req, res) => {
  try {
    res.render("users/home");
  } catch (error) {
    console.log(error);
  }
}

const logoutHome = async (req, res) => {
  try {
    res.render("/");
  } catch (error) {
    console.log(error);
  }
}


//setup shopPage
const shopPage= async(req,res)=>{
  try {
    res.render('pages/shop')
  } catch (error) {
    console.log(error);
    
  }
}


//set cart
const cartPage= async (req,res)=>{
  try {
    res.render('pages/products')
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  loadAuth,
  succeccGoogleLogin,
  failureGoogleLogin,
  loadFacebook,
  succeccfacebookLogin,
  failurefacebookLogin,
  securedPassword,
  loadHome,
  loginPage,
  verifyLogin,
  logintoHome,
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
  cartPage

};
