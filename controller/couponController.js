
const mongoose = require('mongoose') 
const Order = require('../models/ordersModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Address = require('../models/addressModel');
const ObjectId = mongoose.Types.ObjectId 


//set up coupon page
const couponPage = async (req,res)=>{
    try {
        res.render('admin/coupons')
    } catch (error) {
        console.log(error);
        
    }
}

module.exports={
    couponPage
}