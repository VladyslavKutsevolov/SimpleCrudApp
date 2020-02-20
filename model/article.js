const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: String,
  author: String,
  body: String
});

const Article = (module.exports = mongoose.model("Article", schema));
