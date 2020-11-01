const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  brandName: String,
  title: String,
  originalPrice: Number,
  discount: Number,
  sellingPrice: Number,
  color: [String],
  returnDayCount: Number,
  category: {
    mainCategory: String,
    subCategory: String,
  },
  payment: {
    online: Boolean,
    offline: Boolean,
  },
  live: { type: Boolean, default: true },
  sellerBy: String,
  images: [String],
  detailDescription: String,
  productUniqeCode: String,
  quantity: Number,
  stock: Number,
  created_at: { type: Date, default: Date.now },
});

ProductSchema.index({
  title: "text",
  brandName: "text",
  detailDescription: "text",
  "category.mainCategory": "text",
  "category.subCategory": "text",
});

module.exports = mongoose.model("product", ProductSchema);
