const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const session = require("cookie-session");

const app = express();

app.use((req, res) => {
  try {
    if (new Url(req.query.url).host !== "example.com") {
      return res
        .status(400)
        .end(`Unsupported redirect to host: ${req.query.url}`);
    }
  } catch (e) {
    return res.status(400).end(`Invalid url: ${req.query.url}`);
  }
  res.redirect(req.query.url);
});
app.use(helmet());
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "s3Cur3",
    name: "sessionId",
  })
);

const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(
  session({
    name: "session",
    keys: ["key1", "key2"],
    cookie: {
      secure: true,
      httpOnly: true,
      domain: "example.com",
      path: "foo/bar",
      expires: expiryDate,
    },
  })
);

app.listen(3000, () => {
  console.log("hello start");
});
