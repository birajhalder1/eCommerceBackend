const express = require("express");
const {
  addBillingDetails,
  updateBillingDetails,
  removeBillingDetails,
  getBillingDetailsOfUserId,
} = require("../controller/billingDetails");
const { checkAuthCustomer } = require("../middleware/checkAuth");

const route = express.Router();

/**
 * route    POST /api/v1/billingDetails/addDetails
 * desc     add product to wishlist
 * access   Private
 */
route.post("/addDetails", checkAuthCustomer, addBillingDetails);

/**
 * route    GET /api/v1/billingDetails
 * desc     Get single billingDetails by customer
 * access   Private
 */
route.get("/", checkAuthCustomer, getBillingDetailsOfUserId);

/**
 * route    PATCH /api/v1/billingDetails/:billingDetailsId
 * desc     Update billingDetails by customer
 * access   Private
 */
route.patch("/:billingDetailsId", checkAuthCustomer, updateBillingDetails);

/**
 * route    Patch /api/v1/billingDetails/remove/:billingDetailsId
 * desc     Update billingDetails by customer
 * access   Private
 */
route.patch(
  "/remove/:billingDetailsId",
  checkAuthCustomer,
  removeBillingDetails
);

module.exports = route;
