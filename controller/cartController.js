const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Order = require("../models/ordersModel")


//setup cartPage
const cartPage = async (req, res) => {
    try {
      const carts = await Cart.find().populate('products.productId');
  
      const cartData = await Cart.findOne({userId : req.session.user});
  
      console.log(cartData);
  
      res.render('pages/addtoCart', { carts });
    } catch (error) {
      console.error('Error fetching carts:', error);
    }
  };


//product add to cart
const addToCart = async (req, res) => {
    try {
        console.log("Product added to cart");
        const productId = req.body.productId;
      
        const product = await Product.findById(productId);
        if (!product) {
        }

       
        let cart = await Cart.findOne({ userId: req.session.user });
        if (!cart) {
            cart = new Cart({ userId: req.session.user });
        }

       
        const existingProduct = cart.products.find(item => item.productId.toString() === productId);
        if (existingProduct) {
          
            existingProduct.quantity++;
        } else {
        
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

       
        const cart = await Cart.findById(cartId);

      
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

       
        const productIndex = cart.products.findIndex(product => product.productId.toString() === productId);

 

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
    cartPage,
    addToCart,
    removeProductFromCart
}