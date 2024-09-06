const express = require("express");
const session = require("express-session");
const { bypassLogin, checkLoggedIn } = require("./midleware");

const app = express();
const port = 4000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extends: false }));

// Configure session
app.use(
  session({
    secret: "my_session_secret",
    resave: true,
    saveUninitialized: false,
    name: "manfra.io",
    cookie: {
      maxAge: 10000,
    },
  })
);

// Configure locals
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Configure routes
app.get("/", checkLoggedIn, (req, res) => {
  res.render("home");
});

app.get("/login", bypassLogin, (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  if (req.body.username === "john" && req.body.password === "123") {
    // Create session and store user logged details
    req.session.user = { id: 1, username: "john", name: "John Doe" };

    res.redirect("/");
  } else {
    res.render("login", { error: "Wrong credentials" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("manfra.io");
  res.redirect("/");
});

app.listen(port, () => console.log("Start"));
