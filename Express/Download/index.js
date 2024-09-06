const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/download/:filename", (req, res) => {
  const filePath = path.join(
    __dirname,
    "public",
    "assets",
    req.params.filename
  );
  res.download(
    filePath,
    "downloaded-book.jpg", // Remember to include file extension
    (err) => {
      if (err) {
        console.log(err);
        res.send({
          error: err,
          msg: "Problem downloading the file",
        });
      }
    }
  );
});

app.listen(3000, (req, res) => {
  console.log("start");
});
