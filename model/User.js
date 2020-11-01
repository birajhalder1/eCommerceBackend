const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  gender: String,
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password minimum 6 charecter."],
    minlength: 6,
    select: false,
  },
  hashedPassword: {
    type: String,
  },
  phone: {
    type: Number,
    maxlength: [10, "Phone number can not be more than 10 characters"],
  },
  role: {
    customar: Boolean,
    admin: Boolean,
  },
  token: String,
  email_verified: {type:Boolean, default:false},
  phone_verified: {type:Boolean, default:false},
  pin: Number,
  otp: String,
  profileImage: String,
  billingDetails: [{
    cardHolderName: String,
    cardNumber: String,
    validationMonth: Number,
    validationYear: Number 
  }],
  address: [
    {
    addressDetails: {
      name: String,
      mobile: String,
      pincode: Number,
      lat: String,
      lng: String,
      locality: String,
      areaAndStreet: String,
      city: String,
      state: String,
      landmark: String,
      alternative_phone: String
    },
    addressType: String
  }
  ],
  wishlist: [{
    product:{type:mongoose.Types.ObjectId, ref:"Product"},
    created_at:{type:Date, default:Date.now}
  }],
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("user", UserSchema);
