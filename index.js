import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import Category from './models/category.js';
import passport from 'passport'
import passportConfig from './config/passport.js'
import session from 'express-session';
import bodyParser from 'body-parser';
import { handler } from './shopyy/build/handler.js'

const port = 3000;
const app = express();
const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
}

passportConfig(passport);

connectDB();
app.use(
  session({
    secret: 'enhashamanislovely',
    resave:false,
    saveUninitialized:true,
    name:"kurabiye",
    cookie:{
      maxAge: 1000* 60 * 60 *24 * 365
    }
  })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
//app.options('*',cors());

//app.use(express.static(path.join(__dirname,"/shopyy/public")));

app.use(passport.initialize());
app.use(passport.session());

import cartRouter from './routes/cart.js';
app.use("/api/cart", cartRouter);

import usersRouter from './routes/user.js';
app.use("/api/user", usersRouter);

import productsRouter from './routes/products.js';
app.use("/api/products",productsRouter);

import bidsRouter from './routes/bid.js';
app.use("/api/bid",bidsRouter);

app.get('/api/categories', async (req,res) => {
  const categs = await Category.find().exec();
  return res.json({categs})
})

/*app.get("*",(req,res)=>{
  res.sendFile(__dirname+"/shopyy/public/index.html")
})*/

app.get('/mysession',function(req,res,next){
  console.log(req.session);
  res.json(req.session);
});

app.get('/healthcheck', (req,res) => {
  res.end("ok")
})

app.use(handler);

app.set("port", port);
app.listen(port, () => {
  console.log("Server running at port " + port);
});
