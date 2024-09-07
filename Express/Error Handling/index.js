const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("error", { error: err });
}

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
}

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(methodOverride());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.use(errorHandler);
app.use(logErrors);
app.use(clientErrorHandler);

// app.get("/", (req, res) => {
//   throw new Error("BROKEN"); // Express will catch this on its own.
// });

// app.get("/", (req, res, next) => {
//   fs.readFile("/file-does-not-exist", (err, data) => {
//     if (err) {
//       next(err); // Pass errors to Express.
//     } else {
//       res.send(data);
//     }
//   });
// });

app.get(
  "/a_route_behind_paywall",
  (req, res, next) => {
    if (!req.user.hasPaid) {
      // continue handling this request
      next("route");
    } else {
      next();
    }
  },
  (req, res, next) => {
    PaidContent.find((err, doc) => {
      if (err) return next(err);
      res.json(doc);
    });
  }
);

app.get("/user/:id", async (req, res, next) => {
  const user = await getUserById(req.params.id);
  res.send(user);
});

// app.get("/", [
//   function (req, res, next) {
//     fs.writeFile("/inaccessible-path", "data", next);
//   },
//   function (req, res) {
//     res.send("OK");
//   },
// ]);

// app.get("/", (req, res, next) => {
//   setTimeout(() => {
//     try {
//       throw new Error("BROKEN");
//     } catch (err) {
//       next(err);
//     }
//   }, 100);
// });

// app.get("/", (req, res, next) => {
//   Promise.resolve()
//     .then(() => {
//       throw new Error("BROKEN");
//     })
//     .catch(next); // Errors will be passed to Express.
// });

app.get("/", [
  function (req, res, next) {
    fs.readFile("/maybe-valid-file", "utf-8", (err, data) => {
      res.locals.data = data;
      next(err);
    });
  },
  function (req, res) {
    res.locals.data = res.locals.data.split(",")[1];
    res.send(res.locals.data);
  },
]);

app.listen(3000, () => {
  console.log("Hello");
});
