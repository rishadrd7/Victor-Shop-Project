const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
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
        enum: ['Wallet', 'Cash on Delivery', 'Online Payment'],
        
    },
    orderDate: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        enum: ['Delivered', 'Shipping', 'Pending', 'Cancelled', 'Returned'],
        default: 'Pending'
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
    }
});

module.exports = mongoose.model('Order', orderSchema);
