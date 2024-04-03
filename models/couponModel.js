const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    expireDate: {
        type: Date
    },
    discountAmount: {
        type: Number
    },
    minPurchaseAmount: {
        type: Number  // Add minPurchaseAmount field
    },
    maxDiscountLimit: {
        type: Number  // Add maxDiscountLimit field
    },
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Coupon', couponSchema);
