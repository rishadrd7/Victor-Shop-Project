const mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: Objectid,
      ref: "user",
      required: true,
    },
    deliveryAddress: {
      type: Objectid,
      ref: "address",
      required: true,
    },
    payment: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    orderAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    orderedItems: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =  mongoose.model("Order", orderSchema);