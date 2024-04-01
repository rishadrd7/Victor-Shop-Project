
// const { ObjectId } = require("mongodb");
const User = require("../models/userModel");
const otp = require("../models/otp");
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Cart = require("../models/cartModel")
const Address = require("../models/addressModel")
const Order = require("../models/ordersModel")
const Coupon = require("../models/couponModel");
const Offer = require("../models/offerModel");

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const config = require("../config/config");
require('dotenv').config();
const {ObjectId} = require('mongodb')


//google
const loadAuth = (req, res) => {
  res.render('users/login')
}

const successGoogleLogin = async (req, res) => {
  try {
    console.log(req.user);
    res.render('users/home')

  } catch (error) {
    console.log(error);
  }
}

const failureLogin = async (req, res) => {
  try {
    res.render("users/login")
  } catch (error) {
    console.log(error);
  }
}

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user);
})

passport.use(new GoogleStrategy({
  clientID: process.env.CLIEND_ID,
  clientSecret: process.env.CLIEND_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback',
  passReqToCallback: true
},
  function (req, accessToken, refreshToken, profile, done) {
    return done(null, profile)
  }

));



//facebook
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: config.facebookAuth.CliendID,
  clientSecret: config.facebookAuth.CliendSecret,
  callbackURL: config.facebookAuth.callbackURL
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));



//set bcrypt

const securedPassword = async (password) => {

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;

  } catch (error) {
    console.log(error);
  }
}

//forgot bycrypt
const secureToken = async (token) => {

  try {

    const tokenHash = await bcrypt.hash(token, 5);
    return tokenHash;

  } catch (error) {

    console.log(error.message);

  }

};

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
    const message = req.flash('message');
    const msg = req.flash('passwordChanged');
    const passMsg = req.flash('passwordIncorrect');

    res.render("users/login", { message, msg ,passMsg});
  } catch (error) {
    console.log(error);
  }
};


const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;

    const userData = await User.findOne({ email: email });
    console.log(userData);

    if (userData.is_blocked) {
      req.flash('message', 'Account is blocked');
      return res.redirect('/login');
    }

    if (userData) {
      const passwordMatch = await bcrypt.compare(req.body.password, userData.password);

      if (passwordMatch) {
        req.session.user = userData._id;

        res.redirect("/home");
      } else {
        req.flash('passwordIncorrect', 'Incorrect password.'); 
        res.redirect("/login");
      }
    } else {
      req.flash('message', 'Email and Password incorrect.'); // Set flash message for incorrect email/password combination
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);

    // res.status(500).send("Email and Password Incorrect");
  }
}




//setup registration page
const signUp = async (req, res) => {

  try {

    const emailexitss = req.flash("emailexits");
    const confirmPassWrong = req.flash("confirmPassWrong");

    res.render('users/registration', { emailAlredyExits: emailexitss, confirmPassWrongg: confirmPassWrong });

  } catch (error) {

    console.log(error.message);

  }
};





//forgotpassword
const forgotPass = async (req, res) => {
  try {
    const msg = req.flash('message')
    res.render("users/forgotpass", { msg });
  } catch (error) {
    console.log(error);
  }
}

//forgot verify
const forgotVerify = async (req, res) => {
  try {

    const email = req.body.email;
    console.log(email);
    const userData = await User.findOne({ email: email });
    req.session.forgotData = userData;

    if (userData) {
      const name = userData.name;

      const OTPP = generateOTP();
      const token = generateTokenForgottPassword();
      console.log("Forgot Password :-" + OTPP);

      req.session.otp = OTPP;

      sendMailForgotPassword(name, email, OTPP, res, token);

    } else {

      req.flash('message', "Invalid Email");
      res.redirect("/forgotpass");
    }

  } catch (error) {
    console.log(error);

  }
}

//sent otp mail forgot
const sendMailForgotPassword = async (name, email, otpp, res, token) => {

  try {

    //  Send Email Method :-
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rishadrasheed147@gmail.com',
        pass: 'thtp kkww irxp cmox'
      }
    });

    //  Compose Email :-

    const mailOption = {

      from: 'rishadrasheed147@gmail.com',
      to: email,
      subject: 'For Forgot Password Verification',
      html: `<h3> Hello ${name} Welcome to Victor</h3>
          <br><p>Enter ${otpp} on the OTP Box to Change Your Forgotten Password</p>`
    };

    //  Send Email :-

    transporter.sendMail(mailOption, function (error, info) {

      if (error) {

        console.log('Error Sending Email:-', error.message);

      } else {

        console.log("Email Has Been Sended:-", info.response);
      }

    });

    const tokenHashed = await secureToken(token)

    const forgotpassdData = new otp({

      otp: otpp,
      token: tokenHashed,
      userEmail: email,

    });

    forgotpassdData.save();
    res.redirect(`/otppage?email=${email}&&token=${token}`);

  } catch (error) {

    console.log(error.message);

  }

};


//  Genrate OTP For Forgot Password :-

const generateTokenForgottPassword = () => {


  const digits = '0123456789';

  let token = '';

  for (let i = 0; i < 4; i++) {

    token += digits[Math.floor(Math.random() * 10)];
  };

  return token;

}


//forgot load confirm password page
const loadConfirmPassword = async (req, res) => {

  try {

    const forgotEmail = req.query.email
    const forgotpassMsg = req.flash("passwordChanged");

    res.render("users/resetpass", { forgotEmail, msg: forgotpassMsg });

  } catch (error) {

    console.log(error.message);

  }

};


// forgot verifyConfirmPassword (Post Method)

const verifyConfirmPassword = async (req, res) => {

  try {

    const bodyEmail = req.body.email;
    const passwordd = req.body.password;
    const confirmPassword = req.body.confirmPasword;
    console.log(bodyEmail);

    const hashPasswordd = await securedPassword(passwordd);

    if (passwordd == confirmPassword) {

      const emailData = await User.findOne({ email: bodyEmail });

      if (emailData) {

        await User.findOneAndUpdate({ email: bodyEmail }, { $set: { password: hashPasswordd } });
        req.flash('passwordChanged', "Password Changed Successfully");
        res.redirect('/login');

      }

    }
    console.log("password changed successfully");

  } catch (error) {

    console.log(error.message);

  }

};



//signup verify user 
const insertUser = async (req, res) => {

  try {

    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) {

      req.flash('emailexits', "Email Already Exist");
      res.redirect('/registration');

    } else {

      const user = new User({

        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        is_admin: false,
        is_blocked: false

      });

      //  Password and Confirm Password Checkingn :-

      const bodyNorPass = req.body.password;
      const bodyConfrimPass = req.body.confirmPassword;

      if (bodyNorPass == bodyConfrimPass) {

        req.session.userSession = user  //  Save User Data in Session

        const userData = req.session.userSession;


        if (userData) {

          const generatedOTP = generateOTP();    //  Assign OTP to Variable

          req.session.otp = generatedOTP;     //  Otp Saving Session 

          console.log(generatedOTP);

          await sendOTPmail(req.body.name, req.body.email, generatedOTP, res);     // Sended Otp

          setTimeout(async () => {   //  Deleting Otp in the Dbs

            await otp.findOneAndDelete({ emailId: req.body.email });

          }, 60000);

          // res.redirect('/otpVerification');

        } else {

          res.redirect('/registraton');

        };

      } else {

        req.flash("confirmPassWrong", "Password Not Match...");
        res.redirect('/registration');

      }

    }

  } catch (error) {

    console.log(error.message);

  }

};


//setup otp page
const otpPage = async (req, res) => {
  try {

    const queryEmail = req.query.email;
    const invalidOtp = req.flash('flash')
    const tokkken = req.query.token || null;

    console.log(invalidOtp);

    res.render("users/otppage", { queryEmail, tokkken, msg: invalidOtp, otpMsg: "invalidOtp" });

  } catch (error) {
    console.log(error);
  }
}


//  Function to Generator Otp :- ,
const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};


//sent otp mail signup
const sendOTPmail = async (name, email, sendOtp, res) => {

  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rishadrasheed147@gmail.com',
        pass: 'thtp kkww irxp cmox'
      }
    });


    // compose email 
    const mailOption = {
      from: 'rishadrasheed147@gmail.com',
      to: email,
      subject: 'For Otp Verification',
      html: `<h3>Hello ${name},Welcome To Victor</h3> <br> <h4>Enter : ${sendOtp} on the OTP Box to register</h4>`
    }

    //send mail
    transporter.sendMail(mailOption, function (error, info) {

      if (error) {
        console.log('Erro sending mail :- ', error.message);
      } else {
        console.log('Email has been sended :- ', info.response);
      }
    });

    // otp schema adding 
    const userOTP = new otp({
      userEmail: email,
      otp: sendOtp,

    });

    await userOTP.save()

    res.redirect(`/otppage?email=${email}`)

    console.log('otp saved');

  } catch (error) {
    console.log(error.message);
  }
}


//verify OTP signup

const verifyOTP = async (req, res) => {

  try {
    const userSessionn = req.session.userSession;   //  Assign Session in Variable
    const getQueryEMail = req.body.email;
    const getToken = req.body.token;

    console.log(getToken);


    const bodyOtp = req.body.inp1 + req.body.inp2 + req.body.inp3 + req.body.inp4;
    if (getToken && getQueryEMail) {

      const verifyForgotEmail = await otp.findOne({ otp: bodyOtp, userEmail: getQueryEMail });

      if (verifyForgotEmail) {

        res.redirect(`/resetpass?email=${getQueryEMail}`);

      } else {

        req.flash('flash', "Invalid OTP!!!");
        res.redirect(`/otppage?email=${getQueryEMail}&&token=${getToken}`);

      }

    } else {

      const verifiedOtp = await otp.findOne({ otp: bodyOtp, userEmail: getQueryEMail });

      if (verifiedOtp) {

        if (userSessionn.email == getQueryEMail) {

          const hashPassword = await securedPassword(req.session.userSession.password);

          const userSessionData = new User({

            name: req.session.userSession.name,
            email: req.session.userSession.email,
            mobile: req.session.userSession.mobile,
            password: hashPassword,
            is_admin: false,
            is_blocked: false,

          });

          userSessionData.save();

          req.session.otp = undefined;    //  Deleting The otp after login user

          req.session.user = userSessionData; //  Save User Data in Session (Orginal)

          await User.findByIdAndUpdate({ _id: userSessionData._id }, { $set: { is_verified: true } });

          req.flash("flash", "Verified Successfully");    //  Sweet Alert
          res.redirect('/home');

        }

      } else {
        req.flash("flash", "Invalid OTP");
        res.redirect(`/otppage?email=${getQueryEMail}`)

      }
    }

  } catch (error) {

    console.log(error);

  }

};


//resend otp signup
const loadResendOtp = async (req, res) => {

  try {

    const userdata = req.query.email;   //  Query Email

    // console.log(userdata + "hahha");

    const userSessionnn = req.session.userSession;  //  Session User Data

    if (userSessionnn.email == userdata) {

      const generatedotp = generateOTP();

      console.log(generatedotp + " Re-send Otp");

      await sendOTPmail(userSessionnn.name, userSessionnn.email, generatedotp, res);

      setTimeout(async () => {    //  This also Deleting the Otp in Dbs 

        await otp.findOneAndDelete({ userEmail: userdata });

      }, 60000);

    }

  } catch (error) {

    console.log(error);

  }

}


//setup main home
const home = async (req, res) => {
  try {
    // const userData = req.session.user
    res.render("users/home");
  } catch (error) {
    console.log(error);
  }
}

//logout button
const logoutHome = async (req, res) => {
  try {
    req.session.user = null
    res.redirect('/')
  } catch (error) {
    console.log(error);
  }
}


// ===================================================views pages=========================================================

//setup shopPage
const shopPage = async (req, res) => {
  try {
    const categories = await Category.find({})
    // const products = await Product.find().populate('category')
    let productss;


    const selectedCategory = req.query.category || 'allCategory'


    const sortBy = req.query.sortby || 'popularity'
    switch (sortBy) {
      case 'lowToHigh':
        productss = await Product.find({ status: false }).sort({ price: 1 }).populate('category')
        break;
      case 'highToLow':
        productss = await Product.find({ status: false }).sort({ price: -1 }).populate('category')
        break;
      case 'alphabetical':
        productss = await Product.find({ status: false }).sort({ name: 1 }).populate('category')
        break;
      case 'analphabetic':
        productss = await Product.find({ status: false }).sort({ name: -1 }).populate('category')
        break;
      case 'latest':
        productss = await Product.find({ status: false }).sort({ _id: -1 }).populate('category')
        break;

      default:
        productss = await Product.find({ status: false }).populate('category')
        break;
    }


    const products = await Product.aggregate([
      {
        $match: {
          status: false,
          quantity: { $gte: 0 }
        }
      },

      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: "$category"
      },
      {
        $match: {
          "category.listed": false
        }
      }
    ]);
    // console.log("products", productss);

    res.render('pages/shop', { product: products, categories: categories, products: productss, selectedCategory })
  } catch (error) {
    console.log(error);

  }
}


//set up product details page
const productDetails = async (req, res) => {
  try {
    const { id } = req.query;

    const pro = await Product.findOne({ _id: id }).populate('category')
    res.render('pages/products', { pro })
  } catch (error) {
    console.log(error);
  }
}


//product search in shop
  const searchProducts = async (req, res) => {
    try {
        // Extract search query from request parameters
        const { q } = req.query;
  
        // Search products and categories simultaneously
        const [products, categories] = await Promise.all([
            Product.find({ $or: [
                { name: { $regex: new RegExp(q, 'i') } },
            ]}),
            Category.find({ name: { $regex: new RegExp(q, 'i') } })
        ]);
  
        res.render('pages/shop', { products, categories });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  };

 

// ==============================set up user Profile=========================

const userProfile = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.session.user })
    console.log(userData);
    res.render('pages/profile', { userData })
  } catch (error) {
    console.log(error);

  }
}

//edit profile
const editProfile = async (req, res) => {
  try {
    const { name, username, mobile } = req.body;

    // Perform any necessary validation or processing here

    // Update the user details in the database
    const user = await User.findOneAndUpdate({ _id: req.session.user }, { name, username, mobile }, { new: true });

    // Assuming you want to redirect to a profile page after submission
    res.redirect('/profile'); // Change this to your desired route
  } catch (error) {
    // Handle errors
    console.error(error);
  }
};


// profile user change password 
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.session.user; // Assuming you store user ID in session

    // Retrieve the user from the database
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid current password' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
  }
};


//================================== setup addressPage=================================
const addressPage = async (req, res) => {
  try {
    const userId = req.session.user;
    const userData = await User.findById(userId);
    const addressData = await Address.find({ userId: userId })
    if (!userData) {
      return res.status(404).send('User not found');
    }

    res.render('pages/address', { userData, addressData });
  } catch (error) {
    console.error(error);
  }
};

//add address 
const addAddress = async (req, res) => {
  try {
    const userId = req.session.user; // Assuming userId is stored in session
    console.log(userId);
    const {
      name,
      phone,
      pincode,
      locality,
      streetaddress,
      place,
      country,
      state,
      landmark,
      alternatePhone
    } = req.body;

    console.log(name);

    // Create a new address object
    const newAddress = new Address({
      userId: userId,
      name: name,
      phone: phone,
      pincode: pincode,
      locality: locality,
      streetaddress: streetaddress,
      place: place,
      country: country,
      state: state,
      landmark: landmark,
      alternatePhone: alternatePhone
    });

    // Save the new address to the database
    await newAddress.save();


    res.redirect('/profile/address')

  } catch (error) {
    console.error(error);
  }
};


//edit profile address
const editAddress = async (req, res) => {
  try {
    const { addressId, name, phone, streetaddress, place, locality, landmark, country, state, pincode, alternatePhone } = req.body;

    // Update address in the database
    await Address.findByIdAndUpdate(addressId, {
      name,
      phone,
      streetaddress,
      place,
      locality,
      landmark,
      country,
      state,
      pincode,
      alternatePhone
    });

    res.redirect('/profile/address')

    console.log(addressId + "  Address changed");
  } catch (error) {
    console.error(error);
  }
};


//delete address
const deleteAddress = async (req, res) => {
  try {
    const addressId = req.body.id;
    await Address.findByIdAndDelete(addressId);
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error(error);
  }
};

//================================= addtoCart============================

//setup addtoCart
// const addtoCart = async (req, res) => {
//   try {
//     const carts = await Cart.find().populate('products.productId');

//     const cartData = await Cart.findOne({userId : req.session.user});

//     console.log(cartData);

//     res.render('pages/addtoCart', { carts });
//   } catch (error) {
//     console.error('Error fetching carts:', error);
//   }
// };


//======================================set up checkout============================================


// setup checkout page
const checkoutPage = async (req, res) => {
  try {
    const userId = req.session.user;
    const userData = await User.findById(userId);
    const addressData = await Address.find({ userId: userId })
    const carts = await Cart.find().populate('products.productId');
    if (!userData) {
      return res.status(404).send('User not found');
    }

    res.render('pages/checkout', { userData, addressData, carts })
  } catch (error) {
    console.log(error);

  }
}

//edit checkoutAddress
const editCheckoutAddress = async (req, res) => {
  try {

    const { addressId, name, phone, streetaddress, place, locality, landmark, country, state, pincode, alternatePhone } = req.body;

    // Update address in the database
    await Address.findByIdAndUpdate(addressId, {
      name,
      phone,
      streetaddress,
      place,
      locality,
      landmark,
      country,
      state,
      pincode,
      alternatePhone
    });

    // Redirect to the checkout page or the appropriate page after address is edited
    res.redirect('/checkout');

    console.log(addressId + " Address changed");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error'); // Handle errors appropriately
  }
};


//add address to checkout page
const addCheckoutAddress = async (req, res) => {
  try {
    console.log("add new address");
    const userId = req.session.user; // Assuming userId is stored in session
    console.log(userId);
    const {
      name,
      phone,
      pincode,
      locality,
      streetaddress,
      place,
      country,
      state,
      landmark,
      alternatePhone
    } = req.body;

    console.log(name, " address added in checkout page");

    // Create a new address object
    const newAddress = new Address({
      userId: userId,
      name: name,
      phone: phone,
      pincode: pincode,
      locality: locality,
      streetaddress: streetaddress,
      place: place,
      country: country,
      state: state,
      landmark: landmark,
      alternatePhone: alternatePhone
    });

    // Save the new address to the database
    await newAddress.save();


    res.redirect('/checkout')

  } catch (error) {
    console.error(error);
  }
};


// Place order from checkout
const placeOrder = async (req, res) => {
  try {

    const { userId, address, paymentMethod , totalAmount } = req.body;
    console.log(userId, address, paymentMethod)
    console.log(totalAmount, "diss");

    const ad = await Address.findOne({ userId: req.session.user, _id: address });
    const cart = await Cart.findOne({ userId: req.session.user });
    console.log('this : ' + ad)

    const data = {
      name: ad.name,
      phone: ad.phone,
      pincode: ad.pincode,
      locality: ad.locality,
      streetaddress: ad.streetaddress,
      place: ad.place,
      country: ad.country,
      state: ad.state,
      landmark: ad.landmark
    }

    const newOrder = new Order({
      userId,
      orderUserDetails: data,
      products: cart.products,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : '',
      totalAmount
    });

    //delete product from cart
    await Cart.deleteOne({ userId: req.session.user });

    await newOrder.save();

    res.json({ status: true });
  } catch (error) {
    console.error(error);
  }
};


//======================================set up orderpage============================================


// orders list  in Profile
  const orderPage = async (req, res) => {
    try {
      const userData = await User.findOne({ _id: req.session.user });
      // const orders = await Order.find({ userId: req.session.user }).populate('products.productId').sort({ orderDate: 1 });
      const orderlist = await Order.aggregate([
        {
          $match: {
            userId:new ObjectId( req.session.user)
          }
        },
        {
          $unwind: "$products"
        },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "productDetail"
          }
        },{
          $sort:{
            "orderDate": -1 // Sort by orderDate in descending order
          }
        },
        {$unwind:'$productDetail'}
      ]
      )
      console.log(orderlist);

      res.render('pages/ordersPage', { userData, orderlist });
    } catch (error) {
      console.error(error);
    }
  };


//order Details page

const orderDetails = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.session.user });
    const orderId = req.params.orderId;

    // Find the order with the provided orderId and populate the products
    const orderDetails = await Order.findOne({ _id: orderId }).populate('products.productId');

    // Render the order detail page with user data and order details
    res.render("pages/orderDetail", { userData, orderDetails });
  } catch (error) {
    console.log(error);
    // Handle error appropriately
  }
};


const cancelOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      
      // Update the order status to "Cancelled"
      const order = await Order.findByIdAndUpdate(orderId, { 
        $set: { 
          'products.$[].status': 'Cancelled' 
        } 
      }, { new: true });
  
      if (!order) {
        return res.status(404).send('Order not found');
      }
  
      res.status(200).send('Order cancelled successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };


//======================================set up coupon============================================


// coupons set in chekout page
const getCoupon = async(req,res)=>{
 try {

  const coupons = await Coupon.find()
  console.log(coupons, "Get coupon");
  res.json(coupons)
 } catch (error) {
  console.log(error);
  
 }
}



const applyCoupon=async (req,res)=>{
  try {
      console.log('its here also in apply coupon ');
      const { couponCode } = req.body;
       console.log(couponCode,'coupon code in apply code');
      const coupon = await Coupon.findOne({ code: couponCode });
      console.log(coupon,'coupon in apply code apply coupon ')
      if (!coupon) {
          return res.json({ success: false, message: 'Coupon not found' });
      }
      const discountAmount = coupon.discountAmount || 0;
      console.log(discountAmount,'discount amount in apply code');
      
      res.json({ success: true, message: 'Coupon applied', discountAmount });
  } catch (error) {
      console.log(error.message);
  }
}
 
 




module.exports = {
  loadAuth,
  successGoogleLogin,
  failureLogin,
  securedPassword,
  loadHome,
  loginPage,
  verifyLogin,
  forgotPass,
  forgotVerify,
  sendMailForgotPassword,
  loadConfirmPassword,
  verifyConfirmPassword,
  signUp,
  insertUser,
  otpPage,
  verifyOTP,
  loadResendOtp,
  home,
  logoutHome,



  shopPage,
  searchProducts,
  productDetails,
  userProfile,
  editProfile,
  changePassword,
  addressPage,
  addAddress,
  deleteAddress,
  editAddress,
  checkoutPage,
  editCheckoutAddress,
  addCheckoutAddress,
  placeOrder,
  orderPage,
  orderDetails,
  cancelOrder,
  getCoupon,
  applyCoupon


};
