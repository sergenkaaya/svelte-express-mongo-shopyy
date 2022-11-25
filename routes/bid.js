import express from "express";
const router = express.Router();
import Product from '../models/product.js';
import Category from '../models/category.js';
import Cart from '../models/cart.js';
import middleware from '../helpers/index.js'

router.get("/", async (req,res) => {
    res.json("çalışıyo");
})

router.get("/bids",middleware.isLoggedIn, async (req,res)=> {
    try {
        const bids = await Product.find({"Bid.LastBidder":await req.user._id})
        return res.json({bids})
    }
    catch(err){
        console.log(err)
    }
})

router.post("/make-bid/:id",middleware.isLoggedIn, async (req,res)=>{
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if(product.Bid.price == null){
            res.status(400).json("Bu ürüne teklif verilemez.")
        }
        else if(req.body.BidPrice <= product.Bid.price) {
            res.status(400).json("Düşük veya aynı değerde teklif yapılamaz")
        }
        else {
        product.Bid.price = req.body.BidPrice;
        product.Bid.LastBidder = req.user._id;
        product.Bid.date = Date.now();
        await product.save();

        res.status(200).json("Teklif alındı");
        }
    }
    catch(err) {
        console.log(err)
        res.status(400).json(err);
    }
})

export default router;