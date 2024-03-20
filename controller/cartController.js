const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Order = require("../models/ordersModel")


//product add to cart
const addToCart = async (req, res) => {
    try {
        console.log("Product added");
        const productId = req.body.productId; // Assuming productId is sent in the request body

        // Find the product by its ID
        const product = await Product.findById(productId);
        if (!product) {
        }

        // Create a new cart object or find an existing cart for the user
        let cart = await Cart.findOne({ userId: req.session.user });
        if (!cart) {
            cart = new Cart({ userId: req.session.user });
        }

        // Check if the product already exists in the cart
        const existingProduct = cart.products.find(item => item.productId.toString() === productId);
        if (existingProduct) {
            // If the product already exists, increment its quantity
            existingProduct.quantity++;
        } else {
            // If the product doesn't exist, add it to the cart
            cart.products.push({
                productId: product._id,
                quantity: 1
            });
        }

        // Calculate total price based on the added product
        cart.totalPrice += product.offerPrice;

        await cart.save();

        res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
};



//product remove from cart
const removeProductFromCart = async (req, res) => {
    try {
        const { cartId, productId } = req.params;

        // Find the cart based on cartId
        const cart = await Cart.findById(cartId);

        // Check if the cart exists
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the index of the product to be removed in the cart's products array
        const productIndex = cart.products.findIndex(product => product.productId.toString() === productId);

 

        // Remove the product from the cart's products array
        cart.products.splice(productIndex, 1);

        // Save the updated cart
        await cart.save();

        return res.status(200).json({ message: "Product removed from cart successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



module.exports={
    addToCart,
    removeProductFromCart
}