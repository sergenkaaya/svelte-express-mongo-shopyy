import express from "express";
const router = express.Router();
import Product from "../models/product.js";
import { faker } from "@faker-js/faker";
import Cart from "../models/cart.js";
import middleware from "../helpers/index.js";
import Order from "../models/order.js";

router.post("/addtocart/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    let user_cart;
    if (req.user) {
      user_cart = await Cart.findOne({ user: req.user._id });
    }
    let cart;
    if (
      (req.user && !user_cart && req.session.cart) ||
      (!req.user && req.session.cart)
    ) {
      cart = await new Cart(req.session.cart);
    } else if (!req.user || !user_cart) {
      cart = new Cart({});
    } else {
      cart = user_cart;
    }

    const product = await Product.findById(productId);
    const itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].qty++;
      cart.items[itemIndex].price =
        cart.items[itemIndex].qty * product.BuyOutprice;
      cart.totalQty++;
      cart.totalCost += product.BuyOutprice;
    } else {
      cart.items.push({
        productId: productId,
        qty: 1,
        price: product.BuyOutprice,
        title: product.title,
        productCode: product.productCode,
      });
      cart.totalQty++;
      cart.totalCost += product.BuyOutprice;
    }

    if (req.user) {
      cart.user = req.user._id;
      await cart.save();
    }

    req.session.cart = cart;
    console.log(req.session.cart);
    return res.send("Eklendi");
  } catch (error) {
    console.log(error);
    return error;
  }
});

router.get("/shopping-cart", async (req, res) => {
  try {
    let cart_user;
    if (req.user) {
      cart_user = await Cart.findOne({ user: req.user._id });
    }

    if (req.user && cart_user) {
      req.session.cart = cart_user;
      const cartItems = await productsFromCart(cart_user);
      return res.json({ cart: cart_user, cartItems });
    }

    if (!req.session.cart) {
      return res.status(200).json({ cart: null });
    }

    const cartItems = await productsFromCart(req.session.cart);
    return res.json({ cart: req.session.cart, cartItems });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/reduce/:id", async (req, res) => {
  const productId = req.params.id;
  let cart;
  try {
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id });
    } else if (req.session.cart) {
      cart = await new Cart(req.session.cart);
    }
    console.log(cart.items);
    let itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      const product = await Product.findById(productId);
      cart.items[itemIndex].qty--;
      cart.items[itemIndex].price -= product.BuyOutprice;
      cart.totalQty--;
      cart.totalCost -= product.BuyOutprice;

      if (cart.items[itemIndex].qty <= 0) {
        await cart.items.remove({ _id: cart.items[itemIndex]._id });
      }
      req.session.cart = cart;
      if (req.user) {
        await cart.save();
        console.log(cart);
      }
      if (cart.totalQty <= 0) {
        await Cart.findByIdAndRemove(cart._id);
      }
    }
    res.status(200).json("ok -1");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post("/removeAll/:id", async (req, res) => {
  const productId = req.params.id;
  let cart;
  try {
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id });
    } else if (req.session.cart) {
      cart = await new Cart(req.session.cart);
    }
    let itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      cart.totalQty -= cart.items[itemIndex].qty;
      cart.totalCost -= cart.items[itemIndex].price;
      await cart.items.remove({ _id: cart.items[itemIndex]._id });
    }
    req.session.cart = cart;
    if (req.user) {
      await cart.save();
    }
    if (cart.totalQty <= 0) {
      await Cart.findByIdAndRemove(cart._id);
    }

    res.status(200).json("ok hepsi puf");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post("/checkout", middleware.isLoggedIn, async (req, res) => {
  
  if (!req.session.cart) {
    return res.status(400).json("SEPET YOK!");
  }
  
  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let todayf = new Date(year,month+1);

  let ccExpDatef_f = new Date(req.body.ccExpDate);

  if (ccExpDatef_f < todayf) return res.status(400).json("Kartın son kullanıım tarihi geçersiz.");
  
  const cart = await Cart.findById(req.session.cart._id);
  const order = new Order({
    user: req.user,
    orderCode: faker.helpers.replaceSymbolWithNumber("ORD-####-####"),
    cart: {
      totalQty: cart.totalQty,
      totalCost: cart.totalCost,
      items: cart.items,
    },
    paymentInfo: {
      creditCardHolder: req.body.ccHolder,
      creditCardNumber: req.body.ccNumber,
      expDate: req.body.ccExpDate,
      cvv: req.body.ccCVV,
    },
  });
  order.save(async (err, newOrder) => {
    if (err) {
      console.log(err);
      return res.status(400).json("Hata");
    }
    await cart.save();
    await Cart.findByIdAndDelete(cart._id);
    req.session.cart = null;
    return res.status(200).json(order);
  });
});

router.get("/orders", middleware.isLoggedIn, async (req, res) => {
  try {
    const orders = await Order.find({ user: await req.user._id });
    let products = [];
    for (let index = 0; index < orders.length; index++) {
      products.push(await productsFromOrder(orders[index]));
    }
    return res.status(200).json({ orders, products });
  } catch (err) {
    console.log(err);
  }
});

async function productsFromOrder(order) {
  let products = []; // array of objects
  for (const item of order.cart.items) {
    let foundProduct = (
      await Product.findById(item.productId).populate("category")
    ).toObject();
    foundProduct["qty"] = item.qty;
    foundProduct["totalPrice"] = item.price;
    products.push(foundProduct);
  }
  return products;
}

async function productsFromCart(cart) {
  let products = []; // array of objects
  for (const item of cart.items) {
    let foundProduct = (
      await Product.findById(item.productId).populate("category")
    ).toObject();
    foundProduct["qty"] = item.qty;
    foundProduct["totalPrice"] = item.price;
    products.push(foundProduct);
  }
  return products;
}

export default router;
