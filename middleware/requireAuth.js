const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;

  // detect jwt then verify
  if (token) {
    jwt.verify(token, process.env.JWTSECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/user/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/user/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWTSECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);

        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken._id);
        let { _id } = await User.findById(decodedToken._id);

        req.user = await User.findOne({ _id }).select("_id");
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
