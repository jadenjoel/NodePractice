const express = require("express");
let ejs = require("ejs");

const morgan = require("morgan");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");
require("dotenv").config();
const { auth, requiresAuth } = require("express-openid-connect");
const userRoutes = require("./routes/user");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/requireAuth");

let port = process.env.PORT || 8080;

// Express app
const app = express();
// Connect to mongoDB
const uri = process.env.dbURI;

mongoose
  .connect(uri)
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
  })
);

// Register view engine
app.set("view engine", "ejs");

// Middleware and static files

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
// app.use(requireAuth());

// routes
app.get("*", checkUser);

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});
app.get("/secret", requiresAuth(), (req, res) => {
  res.render("secret", {
    title: "Secret",
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user,
  });
});

// Redirects
app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

// blog routes
app.use("/blogs", blogRoutes);
app.use("/user", userRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
