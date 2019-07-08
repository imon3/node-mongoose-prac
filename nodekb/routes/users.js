const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = express.Router();

// User Model
const User = require("../models/user");

// Get Request
// Register Form
router.get("/register", async (req, res) => {
  try {
    res.render("register");
  } catch (err) {
    console.log(err);
  }
});

// User Login
router.get("/login", (req, res) => {
  res.render("login");
});

// Logout Process
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect("/users/login");
});

//Post Requset
// Register Process
router.post("/register", async (req, res) => {
  try {
    const { name, email, username, password, confirmPassword } = await req.body;

    check(["name", "Name is required"])
      .not()
      .isEmpty();
    check(["email", "Email is required"])
      .not()
      .isEmpty()
      .isEmail();
    check(["username", "Username is required"])
      .not()
      .isEmpty();
    check(["password", "Password is required"])
      .not()
      .isEmpty();
    check(["conformPassword", "Confrim Password is required"]).equals(
      req.body.password
    );

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      res.render("register", {
        errors: errors.array()
      });
    } else {
      let user = await new User();
      user.name = name;
      user.email = email;
      user.username = username;
      user.password = password;

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) {
            console.log(err);
          } else {
            user.password = hash;
            user.save(err => {
              if (err) {
                console.log(err);
              } else {
                req.flash("succes", "You are now register and can log in");
                res.redirect("/users/login");
              }
            });
          }
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// Login Process
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
