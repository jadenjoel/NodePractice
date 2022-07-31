const express = require("express");
let ejs = require("ejs");
const morgan = require("morgan");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");
require("dotenv").config();
const { auth, requiresAuth } = require("express-openid-connect");

let port = process.env.PORT || 8080;

// Express app
const app = express();
// Connect to mongodb
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

// app.get("/", (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
// });

// routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// Redirects
app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

// blog routes
app.use("/blogs", blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
