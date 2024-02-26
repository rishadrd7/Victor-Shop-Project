const User=require("../models/userModel");
const Product = require('../models/adminProduct'); // Import the Product model
const multer = require("multer");
const sharp = require("sharp");
// const upload = multer({ dest: "uploads/" });

// set up adminproduct
const product= async(req,res)=>{
    try {
        res.render('admin/productPage')
    } catch (error) {
        console.log(error);
        
    }
}

// set usersPage
const userpage =async(req,res)=>{
    try {
        const users = await User.find();
        // console.log(users,'users in dashboars'); 
        res.render('admin/adminUser',{users})
    } catch (error) {
        console.log(error);
        
    }
}



// Controller function to fetch all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Route handler for creating a new product
const createProduct = async (req, res) => {
    const { name, description, price, category, quantity } = req.body;
    const imageUrl = req.file.path; // Path to uploaded image

    // Perform image cropping using Sharp (example)
    const croppedImageBuffer = await sharp(imageUrl)
        .resize(200, 200)
        .toBuffer();

    // Save the cropped image to a new file or cloud storage
    // Example: save to a new file
    const croppedImagePath = "uploads/cropped-" + req.file.filename;
    await sharp(croppedImageBuffer).toFile(croppedImagePath);

    // Create a new product with cropped image URL
    const product = new Product({
        name,
        description,
        price,
        category,
        quantity,
        imageUrl,
        croppedImageUrl: croppedImagePath
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};






module.exports = {
    product,
    userpage,
    getAllProducts,
    createProduct,
};
