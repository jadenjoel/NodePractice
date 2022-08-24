const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWTSECRET, { expiresIn: "1d" });
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // Create token
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true });

    // res.status(200).json({ user: user._id });
    if (user) {
      res.redirect("/");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.signup(email, password);

    // Create token
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true });

    console.log(user);

    if (user) {
      res.redirect("/");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logoutUser = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
};
