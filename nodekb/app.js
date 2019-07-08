const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressMessages = require("express-messages");
const passport = require("passport");
const config = require("./config/database");

// Routes Fies
const articles = require("./routes/articles.js");
const users = require("./routes/users.js");

mongoose.connect(config.database);

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

// Express Session Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});

// Passport Config
require("./config/passsport")(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

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

// Route Path
app.use("/articles", articles);
app.use("/users", users);

const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
