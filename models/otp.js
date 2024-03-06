const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({

  otp: { type: String, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, expires: "60", default: Date.now },
  
});

const otp = mongoose.model("Otp", OtpSchema);

module.exports = otp;