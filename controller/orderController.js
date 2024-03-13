
const mongoose = require('mongoose') 
const Order = require('../models/ordersModel');
const ObjectId = mongoose.Types.ObjectId 


// set up orderpage
const ordersPage = async (req, res)=>{
    try {
        res.render('admin/orders')
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    ordersPage
}