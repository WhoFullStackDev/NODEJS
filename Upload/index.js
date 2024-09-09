const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploads = multer({ storage: storage });

app.post("/upload", uploads.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({ message: `File ${req.file.filename} uploaded successfully` });
});

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "view"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).render("index");
});

app.listen(3000, () => {
  console.log("Server start on http://localhost:3000");
});
