const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const config = require("./config/database");
const passport = require("passport");

mongoose.connect(config.database, {
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

// Express session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);
// connect-flush middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Passport config
require("./config/passport")(passport);

// Model
const Article = require("./model/article");

//Load view engine
app.set("view engine", "pug");
// Route files
const articles = require("./router/articles");
const user = require("./router/user");
app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  console.log(new Date(), req.originalUrl, res.locals.user);
  next();
});
app.use("/users", user);
app.use("/article", articles);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
  err && console.log(err);
  console.log(`Server running on port: ${PORT}`);
});
