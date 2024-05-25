require("dotenv").config();

// REQUIRE EXPRESS & MONGOOSE
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// EXPRESS APP
const app = express();
app.use(express.json());
app.use(cors());

// REQUIRE UID2 & CRYPTO
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// CONNECT DATABASE MONGODB
mongoose.connect(process.env.MONGODB_URI);

// CLOUDINARY
const cloudinary = require("cloudinary").v2;

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// FILEUPLOAD
const fileupload = require("express-fileupload");

// IMPORT ROUTES
// SIGNUP
const signupRoutes = require("./routes/user.routes");
// PUBLISH
const offerRoutes = require("./routes/offer.routes");

// USE ROUTES
app.use(signupRoutes);
app.use(offerRoutes);

// Route en Get to show into Browser
app.get("/", (req, res) => {
  res.json({ message: "🦊 Hello there! 🦊" });
});

// ALL ROUTES
app.all("*", (req, res) => {
  res.status(404).json({ message: "all routes" });
});
// LISTEN SERVER
app.listen(process.env.PORT, () => {
  console.log("🦊 🦊 server started on port : " + process.env.PORT);
});

//
