const express = require("express");
const path = require("path");

const app = express();

// static file
app.use("/static", express.static(path.join(__dirname, "public")));

// set the view engine to ejs
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

// Dummy users
var users = [
  { name: "tobi", email: "tobi@learnboost.com" },
  { name: "loki", email: "loki@learnboost.com" },
  { name: "jane", email: "jane@learnboost.com" },
];

console.log("Views directory:", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.status(200).render("users", {
    users: users,
    title: "EJS example",
    header: "Some users",
  });
});

app.listen(3000, () => {
  console.log("express start");
});
