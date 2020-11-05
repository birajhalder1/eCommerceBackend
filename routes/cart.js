const express = require("express")
const { createSingleCart, getSingleCartWithId, getAllByAdmin } = require("../controller/cart")
const {checkAuthCustomer, checkAuthAdmin} = require("../middleware/checkAuth")

const route = express.Router();

/**
 * route    POST /api/v1/cart/createCart
 * desc     Create cart by customer
 * access   Private
 */
route.post("/createCart", checkAuthCustomer , createSingleCart);

/**
 * route    GET /api/v1/cart/:cartId
 * desc     Get single cart by customer
 * access   Private
 */
route.get("/:cartId", checkAuthCustomer , getSingleCartWithId);

/**
 * route    GET /api/v1/cart/allCartInfo
 * desc     Get all cart by admin
 * access   Private
 */
route.get("/allCartInfo", checkAuthAdmin , getAllByAdmin);

module.exports = route;