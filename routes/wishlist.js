const express = require("express");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlistOfUserId,
} = require("../controller/wishlist");
const { checkAuthCustomer } = require("../middleware/checkAuth");

const route = express.Router();

/**
 * route    POST /api/v1/wishlist/addProduct/product/:productId
 * desc     add product to wishlist
 * access   Private
 */
route.post(
  "/addProduct/product/:productId",
  checkAuthCustomer,
  addProductToWishlist
);

/**
 * route    GET /api/v1/wishlist
 * desc     Get single wishlist by customer
 * access   Private
 */
route.get("/", checkAuthCustomer, getWishlistOfUserId);

/**
 * route    POST /api/v1/wishlist/removeProduct/product/:productId
 * desc     Update wishlist by customer
 * access   Private
 */
route.post(
  "/removeProduct/product/:productId",
  checkAuthCustomer,
  removeProductFromWishlist
);

module.exports = route;
