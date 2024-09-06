const express = require("express");
const jwt = require("jsonwebtoken");
const verfiy = require("./middleware");

const secret = "HelloWorld";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", verfiy, (req, res) => {
  res.status(200).json({ message: "hi" });
});

app.post("/login", (req, res) => {
  try {
    if (req.body.username === "jhon" && req.body.password === "123") {
      const token = jwt.sign({ user: { id: 1 } }, secret);
      res.status(200).json({ token });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.listen(port, () => {
  console.log("start");
});
