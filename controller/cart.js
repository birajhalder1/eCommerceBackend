const Cart = require("../model/Cart");

exports.createSingleCart = async (req, res) => {
  try {
    const cartDetails = await new Cart({
      product: req.body.product.quantity,
      totalPrize: req.body.totalPrize,
      noOfItem: req.body.noOfItem,
      delivaryCharges: req.body.delivaryCharges,
      subTotal: req.body.subTotal,
      role: {
        customar: false,
        admin: true,
      },
    }).save();

    res.status(201).json({
      success: true,
      data: cartDetails,
      message: "Cart have created",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getAllByAdmin = async (req, res) => {
    try {
        const cart = await Cart.find()

        if(!cart){
            return res.status(400).json({success: false, message: "Cart not found"})
        }else{
            return res.json({
                success: true,
                data: cart
            })
        }
    } catch (error) {
        return res
      .status(400)
      .json({ success: false, message: "Internal server error" }); 
    }
}
