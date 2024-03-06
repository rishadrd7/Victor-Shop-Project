const User=require("../models/userModel");
const Product = require('../models/productModel');
const mongoose = require('mongoose') 
const Category=require('../models/categoryModel')
const ObjectId = mongoose.Types.ObjectId  
const multer=require('multer');
const path=require('path')

const id = new ObjectId()

// set up adminproduct

    const product= async(req,res)=>{
        try {
            
            const products = await Product.find().populate('category');
            // console.log(products)
            res.render('admin/productPage', { products });
            // res.render('admin/productPage')
        } catch (error) {
            console.log(error);
            
        }
    }



//add product

const productAdd = async(req,res)=>{
    try{
        const category=await Category.find()
        res.render('admin/addProduct',{category})
    }catch(error){
        console.log(error);
    }
}


const addProduct = async (req, res) => {
    try {
        console.log('Adding product...');
        const { name, category, price, quantity, date, description, offerPrice, offer } = req.body;
        const images = req.files.map(file => file.filename);
        
        // Convert status to Boolean
        const status = req.body.status === 'on';

        // Create a new Product document
        const newProduct = new Product({
            name,
            category,
            price,
            status,
            quantity,
            date,
            image: images,
            description,
            offerPrice,
            offer
        });

        await newProduct.save();

        res.send('successModal');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    product,
    productAdd,
    addProduct

    
};
    