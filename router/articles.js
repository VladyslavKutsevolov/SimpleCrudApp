const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// Model
const Article = require("../model/article");

// Add article
router.get("/add", (req, res) => {
  res.render("add_article", {
    title: "Add article"
  });
});

// Submit article
router.post(
  "/add",
  [
    check("title", "Title is required").notEmpty(),
    check("author", "Author is required").notEmpty(),
    check("body", "Body is required").notEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      res.render("add_article", {
        title: "Add article",
        errors
      });
    } else {
      const article = new Article();
      article.title = req.body.title;
      article.author = req.body.author;
      article.body = req.body.body;
      article.save(err => {
        err ? console.log(err) : req.flash("success", "Article Added"),
          res.redirect("/");
      });
    }
  }
);

// Edit article
router.get("/edit/:id", (req, res) => {
  const query = req.params.id;
  Article.findById(query, (err, article) => {
    err
      ? console.log(err)
      : res.render("edit_article", {
          title: "Edit Article",
          article
        });
  });
});

// Edit article
router.post("/edit/:id", (req, res) => {
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
  const query = { _id: req.params.id };

  Article.deleteOne(query, err => {
    err ? console.log(err) : req.flash("success", "Article Deleted"),
      res.send("Success");
  });
});

// Get single article
router.get("/:id", (req, res) => {
  const query = req.params.id;
  Article.findById(query, (err, article) => {
    err
      ? console.log(err)
      : res.render("article", {
          article
        });
  });
});

module.exports = router;
