//Declear some variable
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const { db, update } = require("../model/User");
const { checkAuth } = require("../middleware/checkAuth");

/*
 * To exports create user registration api
 * First check email exist or not
 * After then create new user and alse generate hasing password
 */
exports.createUserRegistration = (req, res) => {
  try {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        return res.json({ msg: "Email already exist" });
      } else {
        /** Six Digit OTP Generate  */
        let otp = Math.floor(100000 + Math.random() * 900000);

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone,
          otp,
          profileImage: req.body.thumbnail,
          role: {
            customar: true,
            admin: false,
          },
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            newUser.hashedPassword = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });

        /** Email Sending for notification message */
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });

        var mailOptions = {
          from: process.env.EMAIL,
          to: req.body.email,
          subject: "E-Commerce Website",
          html: `<h2>Welcome to visit our website.</h2><p>Your Registration is successfully.<br />
            Please verify your account<br />
            Your OTP is: ${otp} <br />
            Thank you so much</p>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        console.log("Email have send successfully ..!!");
      }
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

/*
 * To exports create user login api
 * First input email and password
 * Then check email exist or not, if not then display user not found
 * After then compare password like input password and create password
 */
exports.createUserLogin = (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then((user) => {
      // Check user
      if (!user) {
        return res.json({ email: "User not found" });
      }

      // Check password
      bcrypt.compare(password, user.hashedPassword).then(async (isMatch) => {
        if (isMatch) {
          // User match

          const payload = { id: user._id, name: user.name, email: user.email }; //create JWT payload

          // Create JWTToken
          jwt.sign(
            payload,
            process.env.SECRET_OR_KEY,
            { expiresIn: 36000 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
          // await generateBearerToken(user);
        } else {
          res.status(400).json({
            success: false,
            message: "Wrong password please type correct password",
          });
        }
      });
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

/**
 * To export customer profile
 */
exports.loggedInCustomerInfo = async (req, res) => {
  try {
    const loggedinCustomar = await User.findOne({
      _id: mongoose.Types.ObjectId(req.userData.id),
    });
    res.status(200).json({
      success: true,
      data: loggedinCustomar,
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

/**
 * To export customer authenticate
 * Email verified
 */
exports.emailVerified = async (req, res) => {
  // console.log(req.userData);
  try {
    let exist = await User.findOne({
      _id: req.userData.id,
      email_verified: true,
    });
    if (exist) {
      return res.json({ success: false, message: "You are already verified" });
    }
    let otp = req.body.otp;
    let user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.userData.id),
      otp: otp,
    });
    if (user) {
      //matched
      await User.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.userData.id), otp: otp },
        {
          $set: {
            email_verified: true,
            otp: "",
          },
        },
        { new: true }
      );
      res.json({ success: true, message: "Email Verified" });
    } else {
      res.json({ success: true, message: "Wrong OTP" });
    }
  } catch (error) {
    res.json({ success: false });
  }
};

/**
 * check existing email
 * send otp by email
 */
exports.sendEmail = async (req, res) => {
  try {
    /** Six Digit OTP Generate  */
    let otp2 = Math.floor(100000 + Math.random() * 900000);
    let email = req.body.email;
    let checkUser = await User.findOne({ email });

    if (checkUser) {
      /** Update OTP field in database */
      await User.findOneAndUpdate(
        { email },
        { $set: { otp: otp2 } },
        { new: true }
      );
      res.json({ success: true, message: "OTP Update" });

      /** Email Sending for notification message */
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "E-Commerce Website",
        html: `<h2>Welcome to visit our website.</h2>
          <p>
            Forgot password please collect your secret OTP don't share anyone.<br />
            Your OTP is: ${otp2} <br />
            Thank you so much
          </p>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      console.log("Email have send successfully ..!!");
    } else {
      /** User is not match */
      return res
        .status(400)
        .json({ message: "User not exits please try to currect email" });
    }
  } catch (error) {
    res.json({ success: false });
  }
};

/**
 * Input OTP and check database OTP field
 * Update OTP field in the database
 */
exports.OTPMatch = async (req, res) => {
  try {
    let otpFrontend = req.body.otp;
    let email = req.body.email;
    let user = await User.findOne({ otp: otpFrontend, email: email });

    if (user) {
      await User.findOneAndUpdate(
        { otp: otpFrontend, email: email },
        { $set: { otp: "" } },
        { new: true }
      );

      const payload = { id: user._id, name: user.name, email: user.email }; //create JWT payload
      console.log(payload);

      // Create JWTToken
      jwt.sign(
        payload,
        process.env.SECRET_OR_KEY,
        { expiresIn: 36000 },
        (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
          });
        }
      );
      // generateBearerToken(user);
    } else {
      res.json({ success: false, message: "OTP is not match" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

/**
 
 * Create new password also make hash password
 * Update saved password, hash password and set empty otp
 */
exports.updatePassword = async (req, res) => {
  try {
    console.log(req.userData);
    let newPassword = req.body.newPassword;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newPassword, salt, async (err, hash) => {
        if (err) {
          throw err;
        }
        let updatedUser = await User.findOneAndUpdate(
          { _id: req.userData.id },
          {
            $set: {
              hashedPassword: hash,
              password: newPassword,
            },
          },
          { new: true }
        );

        const payload = {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
        }; //create JWT payload
        console.log(payload);

        // Create JWTToken
        jwt.sign(
          payload,
          process.env.SECRET_OR_KEY,
          { expiresIn: 36000 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );

        // await generateBearerToken(updatedUser);
      });
    });
  } catch (error) {
    res.json({ success: false });
  }
};

// const generateBearerToken = async(user) =>{
//   const payload = { id: user._id, name: user.name, email: user.email }; //create JWT payload
//   console.log(payload);

//   // Create JWTToken
//   jwt.sign(
//     payload,
//     process.env.SECRET_OR_KEY,
//     { expiresIn: 36000 },
//     (err, token) => {
//       res.json({
//         success: true,
//         token: "Bearer " + token,
//       });
//     }
//   );
// }
