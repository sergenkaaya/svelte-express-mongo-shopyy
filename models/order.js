import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  orderCode: {
    type: String,
    required: true,
    unique: true,
  },
  cart: {
    totalQty: {
      type: Number,
      default: 0,
      required: true,
    },
    totalCost: {
      type: Number,
      default: 0,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        qty: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
        },
        productCode: {
          type: String,
        },
      },
    ],
  },
  paymentInfo: 
    {
      creditCardHolder : {
        type: String,
        required:true,
      },
      creditCardNumber : {
        type:Number,
        required: true,
      },
      expDate: {
        type: Date,
        required: true
      },
      cvv : {
        type:Number,
        required: true,
      }
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  Delivered: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Order", orderSchema);