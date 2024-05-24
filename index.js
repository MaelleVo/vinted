// REQUIRE EXPRESS & MONGOOSE
const express = require("express");
const mongoose = require("mongoose");

// REQUIRE UID2 & CRYPTO
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// CONNECT DATABASE MONGODB
mongoose.connect("mongodb://localhost:27017/vinted");

// CLOUDINARY
const cloudinary = require("cloudinary").v2;

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: "dpwmvi5bm",
  api_key: "686712395956293",
  api_secret: "Yni9zGCC9XrY_Cd8Jx5keYGwF7s",
});

// FILEUPLOAD
const fileupload = require("express-fileupload");

// IMPORT ROUTES
// SIGNUP
const signupRoutes = require("./routes/user.routes");
// PUBLISH
const offerRoutes = require("./routes/offer.routes");

// EXPRESS APP
const app = express();
app.use(express.json());

// USE ROUTES
app.use(signupRoutes);
app.use(offerRoutes);

// ALL ROUTES
app.all("*", (req, res) => {
  res.status(404).json({ message: "all routes" });
});
// LISTEN SERVER
app.listen(3000, () => {
  console.log("server on");
});
