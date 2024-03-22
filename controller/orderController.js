
const mongoose = require('mongoose') 
const Order = require('../models/ordersModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const ObjectId = mongoose.Types.ObjectId 


//setup order page
const ordersPage = async (req, res) => {
    try {
        const orders = await Order.find().sort({ OrderPlacedDate: -1 }).populate('userId products.productId');
        
        res.render('admin/orders', { orders });
    } catch (error) {
        console.log(error);
    }
};


//view order details
const orderDetails = async (req, res) => {
    try {
       console.log("details");
    
    
        res.render('admin/orderDetails');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {
    ordersPage,
    orderDetails
}