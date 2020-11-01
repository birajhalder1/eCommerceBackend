const express = require("express");
const {
  createProduct,
  imageUpload,
  updateProduct,
} = require("../controller/product");
// const uploads  = require("../middleware/multerUploads")

const route = express.Router();

/**
 * route    POST /api/v1/product/createProduct
 * desc     Create product by admin
 * access   Private
 */
route.post("/createProduct", createProduct);
// route.post("/createProduct", uploads.multer.single('cover'),uploads.fileUpload, createProduct);

/**
 * route    POST /api/v1/product/imageUpload
 * desc     Upload image by admin
 * access   Private
 */
route.post("/imageUpload", imageUpload);

/**
 * route    POST /api/v1/product/updateProduct/:id
 * desc     Update product by admin
 * access   Private
 */
route.patch("/updateProduct/:id", updateProduct);

module.exports = route;
