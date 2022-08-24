const express = require("express");
const { checkUser } = require("../middleware/requireAuth");

//controller functions
const {
  signupUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("*", checkUser);

//Login
router.get("/login", (req, res) => {
  res.render("login", { title: "login" });
});
router.post("/login", loginUser);

//signup
router.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup" });
});
router.post("/signup", signupUser);

//logout
router.get("/logout", logoutUser);

module.exports = router;
