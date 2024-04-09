const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Order = require("../models/ordersModel")


//setup cartPage
const cartPage = async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.productId');
        let listedProductsExist = false;
        let unavailableProducts = [];

        for (const cart of carts) {
            for (const product of cart.products) {
                if (product.productId.status) {
                    listedProductsExist = true;
                    unavailableProducts.push(product.productId.name); // Store the name of the unavailable product
                }
            }
        }

        let errorMessage = '';
        if (listedProductsExist) {
            errorMessage = `The following products in your cart are listed and no longer available: ${unavailableProducts.join(', ')}`;
        }

        res.render('pages/addtoCart', { carts, errorMessage });
    } catch (error) {
        console.error('Error fetching carts:', error);
    }
};






//product add to cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        console.log(productId,'productId',quantity,'quantitiy in addToCart');
       

        let cart = await Cart.findOne({ userId: req.session.user });
        if (!cart) {
            cart = new Cart({
                userId: req.session.user,
                products: []
            });
        }
        console.log(cart,'Product added in Cart');
        
        const existt=await Cart.findOne({userId:req.session.user,'products.productId':productId})
        console.log(existt,'existtt ');
        if(existt){
            await Cart.findOneAndUpdate(
                {userId:req.session.user,'products.productId':productId},
                {$inc:{'products.$.quantity':quantity||1}}
            ) 
            res.json({ success: true, exists: true });

        }else{
            cart.products.push({
                productId:productId,
                quantity:quantity
            })
            await cart.save()
            res.json({success:true,exists:false})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false });
    }
};


const checkStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body; // Get the requested quantity from the request body
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (quantity > product.quantity) {
            // If the requested quantity exceeds the available stock, return a specific message
            return res.json({ success: false, message: 'The requested quantity exceeds the available stock.' });
        }

        // If the requested quantity is within the available stock, return the stock information
        return res.json({ success: true, stock: product.quantity });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};



const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params
        console.log(productId,'prodouct id in ');
        // const { quantity, totalPrice } = req.body
        const {quantity}=req.body
        console.log('quantity in updateCartQuantity',quantity);


        const cart = await Cart.findOneAndUpdate(
            { userId: req.session.user, 'products.productId': productId },
            { $set: { 'products.$.quantity': quantity} },
            { new: true }
        )
        console.log(cart,'cart in update cart quantity');
        res.json({ success: true, cart , message: 'Cart updated successfully'})
    } catch (error) {

        console.log(error.message+'dfdfdff');
    }
}



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



module.exports = {
    cartPage,
    addToCart,
    checkStock,
    updateCartQuantity,
    removeProductFromCart
}