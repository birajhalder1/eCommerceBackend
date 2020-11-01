const express = require("express");
const {
  createUserRegistration,
  createUserLogin,
  loggedInCustomerInfo,
  emailVerified,
  sendEmail,
  OTPMatch,
  updatePassword
} = require("../controller/user");

const {
  checkAuth,
  checkAuthAdmin,
  checkAuthCustomer,
} = require("../middleware/checkAuth");


const route = express.Router();

/**
 * route    POST /api/v1/user/signup
 * desc     Create user registration
 * access   Public
 */
route.post("/signup", createUserRegistration);

/**
 * route    POST /api/v1/user/signin
 * desc     Create user login
 * access   Public
 */
route.post("/signin", createUserLogin);

/**
 * route    POST /api/v1/user/emailVerify
 * desc     Create email verified
 * access   Private
 */
route.post("/emailVerify", checkAuthCustomer, emailVerified);

/**
 * route    GET /api/v1/user/loggedInCustomerInfo
 * desc     Get all customer after login by admin
 * access   Private
 */
route.get("/loggedInCustomerInfo", checkAuthCustomer, loggedInCustomerInfo);

/**
 * route    POST /api/v1/user/sendEmail
 * desc     Send email for OTP generate and update OTP field in the database
 * access   Public
 */
route.post("/sendEmail", sendEmail);

/**
 * route    POST /api/v1/user/recover/code
 * desc     OTP matching by customer
 * access   Public
 */
route.post("/recover/code", OTPMatch);

/**
 * route    POST /api/v1/user/updatePassword
 * desc     Update password
 * access   Public
 */
route.post("/updatePassword",checkAuthCustomer, updatePassword);

module.exports = route;
