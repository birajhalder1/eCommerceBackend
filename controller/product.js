const Product = require("../model/Product");
const mongoose = require('mongoose');

exports.createProduct = async(req, res) => {
  try {
    /**loophole - two code can be same  */
    const rendom_character = Math.random().toString(36).substr(2, 4 );
    const productCode = rendom_character.toUpperCase();

    /** Create product object */
    let insertedProduct = await new Product({
      brandName: req.body.brandName,
      title: req.body.title,
      originalPrice: req.body.originalPrice,
      discount: req.body.discount,
      color: req.body.color,
      returnDayCount: req.body.returnDate,
      payment: {
        online: true,
        offline: false,
      },
      sellerBy: req.body.sellerBy,
      live: true,
      detailDescription: req.body.detailDescription,
      productUniqeCode: productCode,
      stock: req.body.stock,
      quantity: req.body.stock
      
    }).save()

      res.status(201).json({success:true, message:"Product Saved", data:insertedProduct});
  } catch (error) {
    return res.status(400).json({ success: false });
  }
};

exports.updateProduct = async (req, res) => {

  try {
    let updatedData = await Product.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)},{$set:req.body},{new:true})
    // const productall = await Product.find()
    // console.log(productall)
    // const product = await Product.findByIdAndUpdate(req.body, req.params.id, {
    //   new: true,
    //   runValidators: true,
    // });

    // if (!product) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: " Product not found" });
    // }
    res.json({
      success: true,
      message:"Product Updated",
      data: updatedData,
    });
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ success: false, message: "Internal server error" });
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
    return res
      .status(400)
      .json({ success: false, message: "Image can not uploaded !" });
  }
};
