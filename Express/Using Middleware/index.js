const express = require("express");
const app = express();
const router = express.Router();
const cookieParser = require("cookie-parser");

// load the cookie-parsing middleware
app.use(cookieParser());

// use the router and 401 anything falling through
app.use("/admin", router, (req, res) => {
  res.sendStatus(401);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// a middleware function with no mount path. This code is executed for every request to the router
router.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use(
  "/user/:id",
  (req, res, next) => {
    console.log("Request URL:", req.originalUrl);
    next();
  },
  (req, res, next) => {
    console.log("Request Type:", req.method);
    next();
  }
);

router.use((req, res, next) => {
  if (!req.headers["x-auth"]) return next("router");
  next();
});

router.get("/user/:id", (req, res) => {
  res.send("hello, user!");
});

// a middleware sub-stack that handles GET requests to the /user/:id path
router.get(
  "/user/:id",
  (req, res, next) => {
    // if the user ID is 0, skip to the next router
    if (req.params.id === "0") next("route");
    // otherwise pass control to the next middleware function in this stack
    else next();
  },
  (req, res, next) => {
    // render a regular page
    res.render("regular");
  }
);

// handler for the /user/:id path, which renders a special page
router.get("/user/:id", (req, res, next) => {
  console.log(req.params.id);
  res.render("special");
});

// mount the router on the app
app.use("/", router);

app.listen(3000, () => {
  console.log("start");
});
