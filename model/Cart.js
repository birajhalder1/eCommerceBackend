const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  product: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "Product" },
      quantity: Number,
      deleted: Boolean,
      created_at:{type:Date, default:Date.now},
      updated_at:{type:Date, default:Date.now}
    },
  ],
  totalPrize: Number,
  noOfItem: Number,
  delivaryCharges: Number,
  subTotal: Number,
});
module.exports = mongoose.model("cart", CartSchema);
