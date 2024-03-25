
const mongoose = require('mongoose') 
const Order = require('../models/ordersModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Offer = require('../models/offerModel');
const ObjectId = mongoose.Types.ObjectId 


//set up offer page
const offerPage = async (req,res)=>{
    try {
        const offers = await Offer.find()
        res.render('admin/offers' , {offers})
    } catch (error) {
        console.log(error);
        
    }
}



module.exports={
    offerPage
}