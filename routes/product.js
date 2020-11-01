const express = require("express");
const {
  createProduct,
  imageUpload,
  updateProduct,
  deleteProduct,
  searchProduct,
  getAllProducts,
  getSingleProductWithId,
} = require("../controller/product");
// const uploads  = require("../middleware/multerUploads")

const route = express.Router();

/**
 * route    GET /api/v1/product/page/:page/limit/:limit
 * desc     get all product by admin
 * access   Private
 */
route.get("/page/:page/limit/:limit", getAllProducts);

/**
 * route    GET /api/v1/product/search/:searchText
 * desc     search product
 * access   Private
 */
route.get("/search/:searchText", searchProduct);

/**
 * route    GET /api/v1/product/:productId
 * desc     search product
 * access   Private
 */
route.get("/:productId", getSingleProductWithId);

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

/**
 * route    DELETE /api/v1/product/deleteProduct/:id
 * desc     delete product by admin
 * access   Private
 */
route.delete("/deleteProduct/:id", deleteProduct);

module.exports = route;
