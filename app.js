const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/crudApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to MongoDB!");
});

const app = express();

app.use(express.static("public"));
//Body parser Midlleware parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const Article = require("./model/article");

//Load view engine
app.set("view engine", "pug");

// Homw page
app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    err
      ? console.log(err)
      : res.render("index", {
          title: "Articles",
          articles
        });
  });
});

// Add article
app.get("/articles/add", (req, res) => {
  res.render("add_article", {
    title: "Add article"
  });
});

// Submit article
app.post("/articles/add", (req, res) => {
  const article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(err => {
    err ? console.log(err) : res.redirect("/");
  });
});

// Get single article
app.get("/article/:id", (req, res) => {
  const query = req.params.id;
  Article.findById(query, (err, article) => {
    err
      ? console.log(err)
      : res.render("article", {
          article
        });
  });
});

// Edit article
app.get("/articles/edit/:id", (req, res) => {
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
app.post("/articles/edit/:id", (req, res) => {
  const query = { _id: req.params.id };
  const article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  Article.updateOne(query, article, err => {
    err ? console.log(err) : res.redirect("/");
  });
});
// Delete article
app.delete("/article/:id", (req, res) => {
  const query = { _id: req.params.id };

  Article.deleteOne(query, err => {
    err ? console.log(err) : res.send("Success");
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
