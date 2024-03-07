
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

        res.redirect('/admin/submit_product');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


//setup editProduct page
const editProduct = async (req, res) => {
    try {
        // Assume you have a way to retrieve the product ID from the request
        const productId = req.params.productId;
        // Fetch the product from the database
        const product = await Product.findById(productId);
        // Fetch categories from the database
        const category = await Category.find();
        // Render the editProduct template with the product and category data
        res.render('admin/editProduct', { product: product, category: category });
    } catch (error) {
        console.log(error);
        // Handle the error appropriately
        res.status(500).send('Error rendering editProduct page');
    }
}



const updateProduct = async (req, res) => {
    try {
        
        const productId = req.params.productId;
        const updatedProductData = req.body;

        // Update the product in the database
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

        // Redirect or send a response
        res.redirect(`/admin/products/${updatedProduct._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating product');
    }
};




// Toggle the status of a product
const toggleProductStatus = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Toggle the status
        product.status = !product.status;
        await product.save();

        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};





module.exports = {
    product,
    productAdd,
    addProduct,
    toggleProductStatus,
    editProduct,
    updateProduct

    
};
    