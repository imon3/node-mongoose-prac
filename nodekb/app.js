const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/nodekb");

const db = mongoose.connection;

// Check Connection
db.once("open", () => {
  console.log("connected to mongoDB");
});

// Check For DB Errors
db.on("error", err => {
  console.log(err);
});

// Initialize App
const app = express();

// Bring In Models
const Article = require("./models/article");

// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body Parser Middlwware
app.use(bodyParser.urlencoded({ extended: false }));
// Parse App JSON
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, "public")));

// Get Route Home
app.get("/", async (req, res) => {
  try {
    await Article.find({}, (err, articles) => {
      res.render("index", {
        title: "Hello",
        articles: articles
      });
    });
  } catch (err) {
    console.log(err);
  }
});

// Add Route
app.get("/articles/add", async (req, res) => {
  try {
    res.render("add_article", {
      title: "Add Article"
    });
  } catch (err) {
    console.log(err);
  }
});

// Get Single Article
app.get("/article/:id", async (req, res) => {
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
app.get("/article/edit/:id", async (req, res) => {
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
app.post("/articles/add", async (req, res) => {
  try {
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
        res.redirect("/");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// Update Submit POST Route
app.post("/articles/edit/:id", async (req, res) => {
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
        res.redirect("/");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// Delete Article
app.delete("/article/:id", async (req, res) => {
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

const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
