import express from 'express';
const router = express.Router();
import Product from '../models/product.js';
import Category from '../models/category.js';
import Cart from '../models/cart.js';
import { faker } from '@faker-js/faker';

router.get("/", async (req, res) => {
  const perPage = 16;
  let page = parseInt(req.query.page) || 1;
  try {
    const categs = await Category.find().exec();
    const products = await Product.find({})
      .sort("-BuyOutprice")
      .populate("category");

    const onlyBiddables = await Product.find({"Bid.price": {$ne:null} })
      .sort("-Bid.price");

    return res.json({ products,onlyBiddables,categs });
  } catch (error) {
    throw error;
  }
});

router.get("/featured",async (req,res) => {
  try {
    const featuredProds= await Product.aggregate(
      [{$sample: {size : 5}}]
    )
    const  featuredCateg = await Category.aggregate(
      [
        {$sample: {size : 1}}
      ]
    )
    const featuredCategProds = await Product.aggregate(
      [
        {$match: {"category": featuredCateg[0]._id}},
        {$sample: {size:5}}
      ]
    )
    const onlyBiddables = await Product.aggregate(
      [
        {$match: {"Bid.price": {$ne:null}}},
        {$sample: {size:5}}
      ]
    ) 
    return res.status(200).json({featuredProds,featuredCateg,featuredCategProds,onlyBiddables})
  }
  catch(err) {
    return res.status(400).json(err)
  }
})

router.get("/only-biddable", async (req,res) => {
  try {
    const products = await Product.find({"Bid.price": {$ne:null} })
      .sort("-Bid.price")
    return res.json({products});
  }
  catch(err) {
    throw err
  }
})

router.get("/:slug", async (req, res) =>{
  try{
    const foundCategory = await Category.findOne({slug:req.params.slug});
    const allProducts = await Product.find({category:foundCategory.id})
    .sort("-BuyOutprice")
    .populate("category");
    
    const onlyBiddables = await Product.find({"Bid.price": {$ne:null},category:foundCategory.id})   
    .sort("-Bid.price")
    .populate("category");
    
    return res.json({allProducts,onlyBiddables});
  }
  catch(error)
  { 
    return error
  }
})

router.get("/:slug/:id", async (req, res) => {
  try{
    const product = await Product.findById(req.params.id).populate("category");
    return res.json({product});
  }catch(error) { return error}
})

router.post("/search", async (req,res) =>{
  const queryString = req.query.search;
  try{
    
    console.log(queryString);
    const products = await Product.find({
      $text : {$search : req.query.search}
    })
    return res.json({products});
  } catch(error) { return error}
})


router.post("/addproduct", async (req, res) => {
  try {
    const categ = await Category.findOne({ title: req.body.category });
    let prod = new Product({
      productCode: faker.helpers.replaceSymbolWithNumber("PR-####-####"),
      title: req.body.title,
      imagePath: req.body.imagePath,
      description: req.body.description,
      BuyOutprice: req.body.BuyOutprice,
      Bid:{
        price:req.body.BidPrice,
        
      },
      category: categ._id,
      available: true,
      manufacturer: "segoxd-twistingnether",
    });
    await prod.save();
    return res.json("Başarıyla eklendi.")
  } catch (error) {
    console.log(error);
    return error;
  }
});

export default router;
