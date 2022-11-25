import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = Schema({
  productCode: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  BuyOutprice: {
    type: Number,
    required: true,
  },
  Bid: {
      price: {
        type: Number,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      LastBidder:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      done: {
        type:Boolean,
        default:false
      }
    },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  manufacturer: {
    type: String,
  },
  available: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({title:"text"});
export default mongoose.model("Product", productSchema);