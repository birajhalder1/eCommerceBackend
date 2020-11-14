const mongoose = require("mongoose");
const User = require("../model/User");

exports.addBillingDetails = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.userData.id });
    if (!user) {
      res.status(200).json({ success: false, message: "User Does not Exist" });
    }
    let prevBillingDetails = user.billingDetails ? user.billingDetails : [];
    prevBillingDetails.push({
      cardHolderName: req.body.cardHolderName,
      cardNumber: req.body.cardNumber,
      validationMonth: req.body.validationMonth,
      validationYear: req.body.validationYear,
    });
    let updatedUser = await User.findOneAndUpdate(
      {
        _id: req.userData.id,
      },
      {
        $set: {
          billingDetails: prevBillingDetails,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedUser.billingDetails,
      message: "Card Details Added",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Internal server error" });
  }
};

exports.updateBillingDetails = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.userData.id });
    if (!user) {
      res.status(200).json({ success: false, message: "User Does not Exist" });
    }
    if (!user.billingDetails) {
      res
        .status(200)
        .json({ success: false, message: "Billing Details Not Available" });
    }

    let prevBillingDetails = user.billingDetails;

    let ind = await getIndex(prevBillingDetails, req.params.billingDetailsId);

    prevBillingDetails[ind] = {
      cardHolderName: req.body.cardHolderName,
      cardNumber: req.body.cardNumber,
      validationMonth: req.body.validationMonth,
      validationYear: req.body.validationYear,
    };

    let updatedUser = await User.findOneAndUpdate(
      {
        _id: req.userData.id,
      },
      {
        $set: {
          billingDetails: prevBillingDetails,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedUser.billingDetails,
      message: "Card Details Updated",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Internal server error" });
  }
};

exports.removeBillingDetails = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.userData.id });
    if (!user) {
      res.status(200).json({ success: false, message: "User Does not Exist" });
    }
    if (!user.billingDetails) {
      res
        .status(200)
        .json({ success: false, message: "Billing Details Not Available" });
    }

    let prevBillingDetails = user.billingDetails;
    let ind = await getIndex(prevBillingDetails, req.params.billingDetailsId);

    prevBillingDetails.splice(ind, 1);

    let updatedUser = await User.findOneAndUpdate(
      {
        _id: req.userData.id,
      },
      {
        $set: {
          billingDetails: prevBillingDetails,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedUser.billingDetails,
      message: "Card Details removed",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Internal server error" });
  }
};

exports.getBillingDetailsOfUserId = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.userData.id),
    });
    res.status(200).json({
      success: true,
      data: user.billingDetails ? user.billingDetails : [],
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Internal server error" });
  }
};

function getIndex(prevBillingDetails, billingDetailsId) {
  for (let i = 0; i <= prevBillingDetails.length - 1; i++) {
    if (prevBillingDetails[i]._id.toString() == billingDetailsId.toString()) {
      return i;
    }
  }
}
