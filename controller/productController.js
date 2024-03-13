
const mongoose = require('mongoose') 
const Product = require('../models/productModel');
const Category=require('../models/categoryModel')
const ObjectId = mongoose.Types.ObjectId  
const multer=require('multer');
const path=require('path');
const { category } = require('./categoryController');
const id = new ObjectId()



// set up adminproduct
const product= async(req,res)=>{
    try {
        
        const products = await Product.find().populate('category');
        // console.log(products)
        res.render('admin/productPage', { products });
    } catch (error) {
        console.log(error);
        
    }
}


//setup add product page

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
        // console.log('Adding product...');
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

        res.redirect('/admin/products' );
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


//setup editProduct page
const editProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        const category = await Category.find();
        res.render('admin/editProduct', { product: product, category: category });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error rendering editProduct page');
    }
}


//update product
const updateProduct = async(req,res)=>{
    try{
        console.log('product');
        const {productId}=req.params;
        console.log(productId);
        const { name,category, description,offerPrice,price,quantity, } = req.body;
        console.log(name,category);
        await Product.updateOne({_id: productId}, {$set: {name:name, category:category, description:description,  offerPrice:offerPrice, price:price , quantity:quantity} });
        res.redirect('/admin/products');
    }catch(error){
        console.log(error.message);
    }
}




//product list and unlist
const listUnlistProduct = async (req, res) => {
    try {
        const { id } = req.params; // Retrieve id from request params
        const { listed } = req.body;
        
        const isListed = listed === 'true';

        await Product.updateOne({ _id: id }, { $set: { listed: isListed } });

        console.log(`Product ${id} ${isListed ? 'listed' : 'unlisted'}`);
        res.json({ status: isListed });
    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = {
    product,
    productAdd,
    addProduct,
    editProduct,
    updateProduct,
    listUnlistProduct

    
};
    