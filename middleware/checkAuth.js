const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../model/User");

/**
 * First save token
 * Next save jwt verified in token and secret or key
 * Check admin authenticate
 */
exports.checkAuthAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_OR_KEY);
    req.userData = decoded
    let user = await User.findOne({_id:decoded._id});
    if (user.role.admin == false) {
      res.json({ error: "Admin Authentication fail" });
    }
    next();
  } catch (error) {
    return res.json({ error: "Authentication fail" });
  }
};

/**
 * First save token
 * Next save jwt verified in token and secret or key
 * Check customer authenticate
 */
exports.checkAuthCustomer = async (req, res, next) => {
  try {

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_OR_KEY);
    req.userData = decoded;
   
    let user = await User.findOne({_id: mongoose.Types.ObjectId(decoded.id)});
    
    if (user.role.customar == false) {
      return res.json({ error: "Customer Authentication fail" });
    }
    next();
  } catch (error) {
    console.log(error)
    return res.json({ error: "Authentication fail" });
  }
};

exports.checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_OR_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.json({ error: "Customer Authentication fail" });
  }
};

