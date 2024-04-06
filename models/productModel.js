const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", 
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: Date, 
        required: true
    },
    image: {
        type: Array, 
        required: true
    },
    description: {
        type: String
    },
    offerPrice: {
        type: Number,
        required: true
    },
    offer: {
        type: Number
    }
    
});

module.exports = mongoose.model("Product", productSchema);
