const Cart = require("../model/Cart");
const mongoose = require("mongoose");
const Product = require("../model/Product");

exports.createSingleCart = async (req, res) => {
  try {
    let subT = 0;
    for (let i = 0; i <= req.body.products.length - 1; i++) {
      let product = await Product.findOne({
        _id: mongoose.Types.ObjectId(req.body.products[i].product),
      });
      if (product) {
        subT = subT + product.sellingPrice * req.body.products[i].quantity;
      }
    }

    const cartDetails = await new Cart({
      user: mongoose.Types.ObjectId(req.userData.id),
      products: req.body.products,
      totalPrice: subT,
      noOfItem: req.body.products.length,
      delivaryCharges: req.body.delivaryCharges,
      subTotal: subT + req.body.delivaryCharges,
    }).save();

    res.status(201).json({
      success: true,
      data: cartDetails,
      message: "Cart have created",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getSingleCartWithId = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await Cart.findOne({ _id: mongoose.Types.ObjectId(cartId) });

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.updateCart = async (req, res) => {
  try {
    /**
     * first create object
     * update object fields
     */

    let subT = 0;
    for (let i = 0; i <= req.body.products.length - 1; i++) {
      let product = await Product.findOne({
        _id: mongoose.Types.ObjectId(req.body.products[i].product),
      });
      if (product) {
        subT = subT + product.sellingPrice * req.body.products[i].quantity;
      }
    }
    const oCart = {
      user: mongoose.Types.ObjectId(req.userData.id),
      products: req.body.products,
      totalPrice: subT,
      noOfItem: req.body.products.length,
      delivaryCharges: req.body.delivaryCharges,
      subTotal: subT + req.body.delivaryCharges,
    }

    const updateCart = await Cart.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      { $set: oCart },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updateCart,
      message: "Cart has updated",
    });
  } catch (error) {
    // console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    res.status(200).json({
      success: true,
      data: cart,
      message: "Cart has been removed !!",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * Remove single product in product array
 * update product array deleted field true
 *
 */

exports.getAllByAdmin = async (req, res) => {
  try {
    const cart = await Cart.find();

    if (!cart) {
      return res
        .status(400)
        .json({ success: false, message: "Cart not found" });
    } else {
      return res.json({
        success: true,
        data: cart,
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Internal server error" });
  }
};
