const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const session = require("express-session");
const flash = require("connect-flash");
const expressMessages = require("express-messages");

// Bring In Models
const Article = require("../models/article");

// Express Session Middleware
router.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

// Express Messages Middleware
router.use(require("connect-flash")());
router.use(function(req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});

// Add Route
router.get("/add", async (req, res) => {
  try {
    res.render("add_article", {
      title: "Add Article"
    });
  } catch (err) {
    console.log(err);
  }
});

// Get Single Article
router.get("/:id", async (req, res) => {
  try {
    const id = await req.params.id;
    await Article.findById(id, (err, article) => {
      res.render("article", {
        article
      });
    });
  } catch (err) {
    console.log(err);
  }
});

// Load Article Edit Form
router.get("/edit/:id", async (req, res) => {
  try {
    const id = await req.params.id;
    await Article.findById(id, (err, article) => {
      res.render("edit_article", {
        title: "Edit Article",
        article
      });
    });
  } catch (err) {
    console.log(err);
  }
});

// Add Submit POST Route
router.post(
  "/add",
  [
    check("title")
      .not()
      .isEmpty()
      .withMessage("Title is required"),
    check("author")
      .not()
      .isEmpty()
      .withMessage("Author is required"),
    check("body")
      .not()
      .isEmpty()
      .withMessage("Body is required")
  ],
  async (req, res) => {
    try {
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
        res.render("add_article", {
          title: "Add Article",
          errors: errors.array()
        });
      } else {
        const { title, author, body } = await req.body;
        let article = await new Article();
        article.title = title;
        article.author = author;
        article.body = body;

        article.save(err => {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash("success", "Article Added");
            res.redirect("/");
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
);

// Update Submit POST Route
router.post("/edit/:id", async (req, res) => {
  try {
    const id = await req.params.id;
    const { title, author, body } = await req.body;
    const article = {};

    article.title = title;
    article.author = author;
    article.body = body;

    const query = { _id: id };
    await Article.update(query, article, err => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success", "Article Updated");
        res.redirect("/");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// Delete Article
router.delete("/:id", async (req, res) => {
  try {
    const id = await req.params.id;
    const query = { _id: id };

    await Article.remove(query, err => {
      if (err) {
        console.log(err);
      } else {
        res.send("Success");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;