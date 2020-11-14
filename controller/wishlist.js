const mongoose = require("mongoose");
const User = require("../model/User");
const Product = require("../model/Product");

exports.addProductToWishlist = async (req, res) => {
  try {
    let productExist = await Product.findOne({
      _id: mongoose.Types.ObjectId(req.params.productId),
    });

    if (!productExist) {
      res
        .status(200)
        .json({ success: false, message: "Product Does not Exist" });
    }

    let user = await User.findOne({ _id: req.userData.id });

    if (!user) {
      res.status(200).json({ success: false, message: "User Does not Exist" });
    }

    let prevWishList = user.wishlist ? user.wishlist : [];

    prevWishList.push({
      product: req.params.productId,
    });

    let updatedUser = await User.findOneAndUpdate(
      {
        _id: req.userData.id,
      },
      {
        $set: {
          wishlist: prevWishList,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedUser.wishlist,
      message: "Product Added to Wishlist",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Internal server error" });
  }
};

exports.getWishlistOfUserId = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.userData.id),
    }).populate({
      path: "wishlist",
      populate: {
        path: "product",
        model: Product,
      },
    });
    res.status(200).json({
      success: true,
      data: user.wishlist ? user.wishlist : [],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Internal server error" });
  }
};

exports.removeProductFromWishlist = async (req, res) => {
  try {
    let productId = mongoose.Types.ObjectId(req.params.productId);
    let user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.userData.id),
    });
    if (!user.wishlist) {
      res.status(200).json({
        success: false,
        message: "Product Does not Exist in wishlist",
      });
    }
    let tempArr = [...user.wishlist];

    let ind = await getIndex(tempArr, productId);
    tempArr.splice(ind, 1);

    let updatedUser = await User.findOneAndUpdate(
      {
        _id: req.userData.id,
      },
      {
        $set: {
          wishlist: tempArr,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedUser.wishlist,
      message: "Product removed to Wishlist",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Internal server error" });
  }
};

function getIndex(tempArr, productId) {
  for (let i = 0; i <= tempArr.length - 1; i++) {
    if (tempArr[i].product.toString() == productId.toString()) {
      return i;
    }
  }
}
