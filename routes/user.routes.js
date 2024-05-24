// REQUIRE EXPRESS
const express = require("express");

// REQUIRE UID2 & CRYPTO
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// REQUIRE THE MODEL => SIGNUP
const User = require("../models/User");

// ROUTER EXPRESS
const router = express.Router();

// POST ====== ROUTE ROUTER TO POST SIGN UP NEW USER
router.post("/signup", async (req, res) => {
  //console.log(req.body);

  try {
    // CHECK IF USERNAME IS WRITTEN
    if (!req.body.username) {
      return res.status(400).json({ message: "You need to have an username" });
    }

    // CHECK IF ALREADY USER
    const emailCheck = await User.findOne({ email: req.body.email });

    if (emailCheck) {
      return res.status(409).json({ message: "This email is already used" });
    }
    // ENCRYPT PASSWORD ==> MULTIPLE ACTIONS
    // PASSWORD CONST
    const password = req.body.password;
    // PASSWORD SALT
    const salt = uid2(16);
    // PASSWORD HASH
    const hash = SHA256(password + salt).toString(encBase64);
    // TOKEN
    const token = uid2(16);

    // NEW SIGNUP
    const newSignup = await new User({
      account: {
        username: req.body.username,
        avatar: req.body.avatar,
      },
      email: req.body.email,
      newsletter: req.body.newsletter,
      token: token,
      hash: hash,
      salt: salt,
    });

    // SAVE NEW SIGN UP USER
    // console.log(newSignup);

    await newSignup.save();

    return res.status(201).json({
      _id: newSignup._id,
      token: newSignup.token,
      account: newSignup.account,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// POST LOGIN
router.post("/login", async (req, res) => {
  // console.log(req.body)
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "email or password is incorrect" });
    }
    // PASSWORD CHECK
    const checkPassword = SHA256(req.body.password + user.salt).toString(
      encBase64
    );

    if (checkPassword === user.hash) {
      return res.status(200).json({
        _id: user._id,
        token: user.token,
        account: user.account,
      });
    } else {
      return res.status(400).json({ message: "email or password incorrect" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EXPORT MODULE ROUTER
module.exports = router;
