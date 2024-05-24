const express = require("express");

// ROUTER EXPRESS
const router = express.Router();

// REQUIRE THE MODEL => PUBLISH
const Offer = require("../models/Offer");
const User = require("../models/User");

// fileupload
const fileupload = require("express-fileupload");

// import convert
const convertToBase64 = require("../utils/convertToBase64");

// cloudinary
const cloudinary = require("cloudinary").v2;

// middleware bearer token
const isAuthenticated = require("../middleware/isAuthenticated");

// POST OFFER PUBLISH
router.post(
  "/offer/publish",
  isAuthenticated,
  fileupload(),
  async (req, res) => {
    try {
      //console.log(req.headers.authorization.replace("Bearer", ""));

      // const token = req.headers.authorization.replace("Bearer", "");
      // const user = await User.findOne({ token: token }).select("account");

      //console.log(req.user);

      // cree une variable de body // destructuring
      //pour eviter de taper tous les noms precis des clés
      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      const pictureData = await cloudinary.uploader.upload(
        convertToBase64(req.files.picture)
      );

      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { MARQUE: brand },
          { TAILLE: size },
          { ETAT: condition },
          { COULEUR: color },
          { EMPLACEMENT: city },
        ],
        product_image: pictureData,
        owner: req.user,
      });

      console.log(newOffer);
      await newOffer.save();
      res.send("Your post have been publish");
    } catch (error) {
      console.log(error.error);
      res.status(500).json({ message: error.message });
    }
  }
);

// OFFERS by FILTERS ============================================
router.get("/offers", async (req, res) => {
  try {
    // const offers = await Offer.find().select("product_name product_price -_id");
    //res.json(offers);

    // SORT filter by name, price min and price max
    const { title, priceMin, priceMax, sort, page } = req.query;
    const filter = {};

    if (title) {
      filter.product_name = new RegExp(title, "i");
    }

    if (priceMin) {
      filter.product_price = { $gte: priceMin };
    }

    if (priceMax) {
      if (filter.product_price) {
        filter.product_price.$lte = priceMax;
      } else {
        filter.product_price = { $gte: priceMax };
      }
    }

    // SORT Filter with price
    const sortFiltered = {};

    if (sort === "price-desc") {
      sortFiltered.product_price = -1; // {product_price: -1}
    } else if (sort === "price-asc") {
      sortFiltered.product_price = 1; // {product_price: 1}
    }

    // PAGES Filter
    const limit = 2;
    // si page 2 => skip 2 // si page 3 skip 4
    // nombre to skip => (page - 1) * limit
    const numberToSkip = (page - 1) * limit;

    // if pageNumber doesn't exist, it will be page 1 (page truthy OR pageNumber = 1 )
    // OTHER METHOD
    // let numberPage = 1
    // if(page){
    // pageNumber = page}

    const pageNumber = page || 1;

    // FIND BY FILTER .find(filter)
    const offers = await Offer.find(filter)
      .sort(sortFiltered)
      .limit(limit)
      .skip(numberToSkip)
      .populate("owner", "account");
    //.select("product_name product_price -_id");

    res.json(offers);
  } catch (error) {
    console.log(error.error);
    res.status(500).json({ message: error.message });
  }
});

// OFFERS by ID ================================================
router.get("/offers/:id", async (req, res) => {
  try {
    const offers = await Offer.findById(req.params.id);
    //console.log(offers);
    res.status(200).json(offers);
  } catch (error) {
    console.log(error.error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// REGEX
// const str = req.query;
// const regex = /adidas/i;
// console.log(req.query);
// const str = new RegExp(regex, "i");

// const offersFiltered = await Offer.find({ product_name: regex })
//   .sort({ product_name: 1 })
//   .select("product_name product_price");

// console.log(offersFiltered);
// res.send(offersFiltered);
