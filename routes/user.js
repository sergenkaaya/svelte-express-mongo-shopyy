import express from 'express';
const router = express.Router();
import csrf from 'csurf';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.js';
import bcrypt from 'bcrypt-nodejs';
import parser from 'body-parser';
import middleware from '../helpers/index.js'
import Product from '../models/product.js';
import Order from '../models/order.js';
import Cart from '../models/cart.js'
var urlencodedParser = parser.urlencoded({ extended: false });

router.get("/", async (req, res) => {
  const users = await User.find().exec();
  return res.json({ users });
});

router.get("/get-user-info",middleware.isLoggedIn, async (req,res) => {
  try {
    const user = await User.findById(req.user._id);
    const userBids = await Product.find({"Bid.LastBidder":await req.user._id});
    const userOrders = await Order.find({user:await req.user._id});
    return res.status(200).json({user,userBids,userOrders});
  }
  catch(error) {
    console.log(error)
    return res.status(400).json(error)
  }

})

router.post("/register",middleware.isNotLoggedIn,async (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.status(400).send("User Already Exists");
    if (!doc) {
      bcrypt.genSalt(10, (err, salt) => {
        if(err) throw err
        bcrypt.hash(req.body.password, salt, null, async (err, hashed) => {
          if (err) throw err;
          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashed,
          });
          
          await newUser.save();
          if (req.session.cart) {
            const cart = await new Cart(req.session.cart);
            cart.user = newUser._id;
            await cart.save();
          }
          res.status(200).send("User Created");
        });
      });
    }
  })
});

router.post("/login",middleware.isNotLoggedIn, async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) throw err;
    if (!user) res.status(400).send({"user":null,"message":"Kullanıcı bulunamadı."});
    else {
      req.logIn(user,async (err) => {
        if (err) throw err;
        
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (req.session.cart && !cart) {
          const cart = await new Cart(req.session.cart);
          cart.user = req.user._id;
          await cart.save();
        }
        
        if (cart) {
          req.session.cart = cart;
        }
        
        req.session.user = req.user.username;
        res.cookie("user",req.user.username);
        return req.session.save((err) => {
          if(err) return err;
          console.log(req.session)
          res.status(200).json(req.session);
          
        })
      });
    }
  })(req, res, next);
});

router.post("/update-password",middleware.isLoggedIn,(req,res) => {
  try{
    bcrypt.genSalt(10, (err, salt) => {
      if(err) throw err
      bcrypt.hash(req.body.password, salt, null, async (err, hashed) => {
        if (err) throw err;
        const user = await User.findByIdAndUpdate(req.user._id,{password:hashed})
        await user.save();
        res.status(200).json("Parola güncellendi.");
      });
    });
  }
  catch(error){
    return res.status(400).json(error)
  }
})

router.post("/logout",async (req,res) => {
  req.logOut();
  req.session.destroy();
  res.clearCookie("user", { path: "/"});
  res.status(200).end();
})

export default router;
