const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type:Number,
    required:true
  },
  pincode: {
    type: Number,
    required: true
  },
  locality: {
    type: String,
    required: true
  },
  streetaddress: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  landmark: {
    type: String,
  },
  alternatePhone:{
    type:Number,
  }
  
});

module.exports = mongoose.model("Address", addressSchema);
