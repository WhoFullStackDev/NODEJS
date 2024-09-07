const express = require("express");
const cookieParser = require("cookie-parser");
const validateCookies = require("./cookiValidator");
const mw = require("./my-middleware.js");

const app = express();

// Middleware function
const myLogger = function (req, res, next) {
  console.log("LOGGED");
  next();
};

const requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};

app.use(cookieParser());
app.use(validateCookies);
app.use(requestTime);
app.use(myLogger);
app.use(mw({ option1: "1", option2: "2" }));

app.get("/", (req, res) => {
  let responseText = "Hello World!<br>";
  responseText += `<small>Requested at: ${req.requestTime}</small>`;
  res.send(responseText);
});

app.listen(3000);
