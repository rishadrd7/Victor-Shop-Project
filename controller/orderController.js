
const mongoose = require('mongoose') 
const Order = require('../models/ordersModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const ObjectId = mongoose.Types.ObjectId 


const ordersPage = async (req, res) => {
    try {
        // Fetch orders from the database sorted by order placement date
        const orders = await Order.find().sort({ OrderPlacedDate: -1 }).populate('userId');
        

        res.render('admin/orders', { orders });
    } catch (error) {
        console.log(error);
    }
};

const orderDetails = async (req,res)=>{
    try {

        res.render('admin/orderDetails' );
    } catch (error) {
        console.log(error);
        
    }
}


module.exports = {
    ordersPage,
    orderDetails
}