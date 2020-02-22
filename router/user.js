const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// User model
const User = require("../model/users");

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Email is required").notEmpty(),
    check("email", "Email is not valid")
      .notEmpty()
      .isEmail(),
    check("username", "Username is required").notEmpty(),
    check("password", "Password is required").notEmpty()
  ],
  (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const userName = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("register", {
        errors
      });
    } else {
      let newUser = new User({
        name,
        email,
        userName,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.log(err);
        } else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
            }
            newUser.password = hash;
            newUser.save(err => {
              err
                ? console.log(err)
                : req.flash("success", "You are registred!"),
                res.redirect("/users/login");
            });
          });
        }
      });
    }
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
