const User=require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Order = require("../models/ordersModel");
const Wishlist = require("../models/wishlistModel");


//setup wishlist page
const wishlistPage = async (req, res) => {
    try {
      console.log('j');
      const wishlist = await Wishlist.find({  }).populate('products')

        
      res.render('pages/wishlist' , {data: wishlist})
    } catch (error) {
      console.log(error);
  
    }
  }
  


  module.exports={
    wishlistPage
  }