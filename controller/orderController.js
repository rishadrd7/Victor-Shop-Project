
const mongoose = require('mongoose') 
const Order = require('../models/ordersModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Address = require('../models/addressModel');
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
        const orderId = req.params.orderId;

        const orderDetails = await Order.findOne({orderId});
        const products = await Product.findOne({ orderId });
        const deliveryAddress = await Order.findOne({ _id : orderId }).populate('products.productId')
        console.log(deliveryAddress);
    
        res.render('admin/orderDetails' ,{ orderId, orderDetails ,products ,deliveryAddress }); // Pass orderId to the template
    } catch (error) {
        console.log(error);
    }
}



//update order status
const updateOrderStatus = async (req, res) => {
    const { orderId, newStatus } = req.body;
    console.log(orderId, newStatus)
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { 'products._id': orderId },
            { $set: { 'products.$.status': newStatus } },
            { new: true } 
        );
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    ordersPage,
    orderDetails,
    updateOrderStatus
}