const Product = require("../model/Product");
const mongoose = require("mongoose");

exports.createProduct = async (req, res) => {
  try {
    /**loophole - two code can be same  */
    const random_character = Math.random().toString(36).substr(2, 4);
    const productCode = random_character.toUpperCase();

    /** Create product object */
    let insertedProduct = await new Product({
      brandName: req.body.brandName,
      title: req.body.title,
      originalPrice: req.body.originalPrice,
      discount: req.body.discount,
      sellingPrice:
        req.body.originalPrice -
        (req.body.originalPrice * req.body.discount) / 100,
      color: req.body.color,
      returnDayCount: req.body.returnDate,
      payment: req.body.payment,
      category: req.body.category,
      sellerBy: req.body.sellerBy,
      images: req.body.images,
      live: true,
      detailDescription: req.body.detailDescription,
      productUniqeCode: productCode,
      stock: req.body.stock,
      quantity: req.body.stock,
    }).save();

    res
      .status(201)
      .json({ success: true, message: "Product Saved", data: insertedProduct });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let updatedData = await Product.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Product Updated",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.searchWithCategory = async (req, res) => {
  try {
    let searchText = req.params.searchText;
    let searchedProducts = await Product.find({
      $or: [
        { "category.mainCategory": new RegExp(searchText, "i") },
        { "category.subCategory": new RegExp(searchText, "i") },
      ],
    }).limit(50);
    res.status(200).json({
      success: true,
      data: searchedProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.searchProduct = async (req, res) => {
  try {
    let searchText = req.params.searchText;
    let searchedProducts = await Product.aggregate([
      {
        $match: {
          $text: {
            $search: searchText,
          },
        },
      },
      { $limit: 50 },
    ]);
    res.status(200).json({
      success: true,
      data: searchedProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let products = await Product.find({})
      .sort({ created_at: -1 })
      .skip(page * limit)
      .limit(limit);
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getSingleProductWithId = async (req, res) => {
  try {
    let productId = req.params.productId;
    let product = await Product.findOne({
      _id: mongoose.Types.ObjectId(productId),
    });
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.imageUpload = (req, res) => {
  try {
    var cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
      api_key: `${process.env.CLOUDINARY_API_KEY}`,
      api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
    });

    const file = req.files.photo;
    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, data: {}, err });
      }
      return res
        .status(200)
        .json({ success: true, data: result, message: "Image uploaded!" });
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Image can not uploaded !" });
  }
};
