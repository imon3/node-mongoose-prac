const path = require("path");
const express = require("express");

const app = express();

// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Get Route Home
app.get("/", async (req, res) => {
  try {
    let articles = [
      {
        id: 1,
        title: "Article One",
        author: "Petter Popper",
        body: "This is Article One"
      },
      {
        id: 2,
        title: "Article Two",
        author: "Mike Jones",
        body: "This is Article Two"
      },
      {
        id: 3,
        title: "Article Three",
        author: "Tom Jerry",
        body: "This is Article Three"
      }
    ];

    res.render("index", {
      title: "Hello",
      articles: articles
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

const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
