const express = require("express");
// const Blog = require("../models/blog");
const blogController = require("../controllers/blogController");
const { auth, requiresAuth } = require("express-openid-connect");
require("dotenv").config();
const app = express();

const router = express.Router();
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

// blog routes
router.get("/", blogController.blog_index);
router.post("/", blogController.blog_create_post);
router.get("/create", requiresAuth(), blogController.blog_create_get);
router.get("/:id", blogController.blog_details);
router.delete("/:id", blogController.blog_delete);

module.exports = router;
