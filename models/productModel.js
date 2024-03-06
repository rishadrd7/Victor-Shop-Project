const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Refers to the Category model
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
        type: Date, // Changed to Date type for better date handling
        required: true
    },
    image: {
        type: Array, // Changed to String as it will store image paths
        required: true
    },
    description: {
        type: String,
        required: true
    },
    offerPrice: {
        type: Number,
        required: true
    },
    offer: {
        type: Number // Offer field is not marked as required
    }
});

module.exports = mongoose.model("Product", productSchema);
