const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// Article Model
const Article = require("../model/article");
// User model
const User = require("../model/users");

// Access Control
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/users/login");
  }
};

// Add article
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add_article", {
    title: "Add article"
  });
});

// Submit article
router.post(
  "/add",
  [
    check("title", "Title is required").notEmpty(),
    check("body", "Body is required").notEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add_article", {
        title: "Add article",
        errors
      });
    } else {
      const article = new Article();
      article.title = req.body.title;
      article.author = req.user._id;
      article.body = req.body.body;
      article.save(err => {
        err ? console.log(err) : req.flash("success", "Article Added"),
          res.redirect("/");
      });
    }
  }
);

// Get edit article
router.get("/edit/:id", (req, res) => {
  const query = req.params.id;
  Article.findById(query, (err, article) => {
    if (err) console.log(err);
    //console.log(req.user);
    if (article.author != req.user._id) {
      req.flash("danger", "Not Authorized");
      res.redirect("/");
    }
    res.render("edit_article", {
      title: "Edit Article",
      article
    });
  });
});

// Edit article
router.post("/edit/:id", ensureAuthenticated, (req, res) => {
  const query = { _id: req.params.id };
  const article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  Article.updateOne(query, article, err => {
    err ? console.log(err) : req.flash("success", "Article Updated"),
      res.redirect("/");
  });
});
// Delete article
router.delete("/:id", (req, res) => {
  if (!req.user._id) {
    res.status(500).send();
  }
  const query = { _id: req.params.id };
  Article.findById(req.params.id, (err, article) => {
    if (article.author != req.user._id) {
      res.status(500).send();
    } else {
      Article.deleteOne(query, err => {
        err ? console.log(err) : req.flash("success", "Article Deleted"),
          res.send("Success");
      });
    }
  });
});

// Get single article
router.get("/:id", (req, res) => {
  const query = req.params.id;
  Article.findById(query, (err, article) => {
    if (err) console.log(err);
    User.findById(article.author, (err, user) => {
      console.log(req.user);
      if (err) console.log(err);
      res.render("article", {
        article,
        author: user.name
      });
    });
  });
});

module.exports = router;
