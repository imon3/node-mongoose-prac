const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

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

// Add Submit POST Route
app.post("/articles/add", async (req, res) => {
  try {
    console.log("submitted");
  } catch (err) {
    console.log(err);
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
