const express = require("express");

const app = express();

// Get Route Home
app.get("/", (req, res) => {
  try {
    res.send("Hello World");
  } catch (err) {
    console.log(err);
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
