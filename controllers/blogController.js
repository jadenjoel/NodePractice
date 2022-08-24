const Blog = require("../models/blog");

// blog_index, blog_details, blog_create_get, blog_create_post, blog_delete

const blog_index = (req, res) => {
  const user_id = req.user._id;
  Blog.find({ user_id })
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "All BLogs", blogs: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

const blog_details = (req, res) => {
  const id = req.params.id;
  console.log(id);

  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      res.render("404", { title: "Blog not found" });
    });
};

const blog_create_get = (req, res) => {
  res.render("create", { title: "Create a new blog" });
};

const blog_create_post = async (req, res) => {
  const user_id = req.user._id;
  const title = req.body.title;
  const snippet = req.body.snippet;
  const body = req.body.body;

  const blog = new Blog({ title, snippet, body, user_id });

  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
};

const blog_delete = (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      console.log(result);
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  // blog_signup_get,
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete,
  // blog_secret,
};
