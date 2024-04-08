const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userdatas',
        
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            
        },
        name: {
            type: String,
            
        },
        quantity: {
            type: Number,
             originalQuantity: Number // New field to store original quantity
            
            
        },
        status: {
            type: String,
            enum: ['Delivered', 'Shipping', 'Pending', 'Cancelled', 'Returned'],
            default: 'Pending'

        },
        priceAtOrder: {
            type: Number // Store the price at the time of ordering
        }
    }],
    orderUserDetails: {
        type:Object,
        
    },
    totalAmount: {
        type: Number,
        
    },
    paymentMethod: {
        type: String,
        enum: ['Wallet', 'Cash on Delivery', 'online'],
        
    },
    orderDate: {
        type: Date,
        default: Date.now()
    },

    cancelReason: {
        type: String
    },
    returnReason: {
        type: String
    },
    couponApplied: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    },
    offerApplied: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    },
    paymentStatus:{
     type: String   
    }
});

module.exports = mongoose.model('Order', orderSchema);
