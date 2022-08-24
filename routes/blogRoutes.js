const express = require("express");

const blogController = require("../controllers/blogController");
const { auth, requiresAuth } = require("express-openid-connect");
require("dotenv").config();
const app = express();

const { requireAuth, checkUser } = require("../middleware/requireAuth");

const router = express.Router();

//req auth for all routes

router.use(requireAuth);

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
app.get("*", checkUser);
router.get("/", blogController.blog_index);
router.post("/", checkUser, blogController.blog_create_post);
router.get("/create", blogController.blog_create_get);
router.get("/:id", blogController.blog_details);
router.delete("/:id", blogController.blog_delete);

module.exports = router;
