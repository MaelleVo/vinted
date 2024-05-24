const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    // console.log(req.headers)
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = req.headers.authorization.replace("Bearer ", "");

    const user = await User.findOne({ token: token }).select("account");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    return next();
  } catch (error) {
    console.log(error.error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
