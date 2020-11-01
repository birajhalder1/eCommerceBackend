const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  brandName: String,
  title: String,
  originalPrice: Number,
  discount: Number,
  sellingPrice: Number,
  color: [String],
  returnDayCount: Number,
  payment: {
    online: Boolean,
    offline: Boolean,
  },
  live: { type: Boolean, default: true },
  sellerBy: String,
  image: [String],
  detailDescription: String,
  productUniqeCode: String,
  quantity: Number,
  stock: Number,
  created_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model("product", ProductSchema);
