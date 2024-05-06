
const mongoose = require('mongoose') 
const Product = require('../models/productModel');
const Category=require('../models/categoryModel')
const ObjectId = mongoose.Types.ObjectId  
const multer=require('multer');
const path=require('path');
const { category } = require('./categoryController');
const { log } = require('console');
const id = new ObjectId()



// set up adminproduct
const product = async (req, res) => {
    try {
        let page = 1;
        const limit = 5;

        if (req.query.page) {
            page = parseInt(req.query.page); // Parse the page query parameter to an integer
        }

        const products = await Product.find()
            .populate('category')
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();

        const count = await Product.find().populate('category').countDocuments();

        res.render('admin/productPage', { 
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page 
        });
    } catch (error) {
        console.log(error);
        // Handle error appropriately, maybe send an error response to the client
        res.status(500).send("Internal Server Error");
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

//post method
const addProduct = async (req, res) => {
    try {
        log("product added")
        const { name, category, price, quantity, date, description, offerPrice, offer } = req.body;
        const images = req.files.map(file => file.filename);

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product name is already in use' });
        }
        
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

        // Send a success response
        res.status(200).json({ message: 'Product added successfully'});
    } catch (error) {
        console.error(error);
        // Send an error response
        res.status(400).json({ message: 'Failed to add product', error: error.message });
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
const updateProduct = async (req, res) => {
    try {
        console.log('product');
        const { productId } = req.params;
        console.log(productId);
        const { name, category, description, offerPrice, price, quantity } = req.body;
        console.log(name, category);

        let updateData = { name, category, description, offerPrice, price, quantity };

        // Check if there are new images
        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => file.filename);
            updateData.image = images;
        }

        await Product.updateOne({ _id: productId }, { $set: updateData });
        res.redirect('/admin/products');
    } catch (error) {
        console.log(error.message);
    }
}





//product list and unlist
const listUnlistProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        console.log(productId, 'Changed');
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Toggle the product status
        product.status = !product.status;
        await product.save();

        // If product is unlisted, remove it from all carts
        if (!product.status) {
            await Cart.updateMany(
                { "products.productId": productId },
                { $pull: { products: { productId: productId } } }
            );
        }

        res.status(200).json({ message: 'Product status toggled successfully' });
    } catch (error) {
        console.log(error.message);
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
    