const compression = require("compression");
const express = require("express");
const app = express();
app.use(compression());

app.get("/search", (req, res) => {
  // Simulating async operation
  setImmediate(() => {
    const jsonStr = req.query.params;
    try {
      const jsonObj = JSON.parse(jsonStr);
      res.send("Success");
    } catch (e) {
      res.status(400).send("Invalid JSON string");
    }
  });
});

app.get("/", (req, res, next) => {
  // do some sync stuff
  queryDb()
    .then((data) => makeCsv(data)) // handle data
    .then((csv) => {
      /* handle csv */
    })
    .catch(next);
});

app.use((err, req, res, next) => {
  // handle error
});

const wrap =
  (fn) =>
  (...args) =>
    fn(...args).catch(args[2]);

app.get(
  "/",
  wrap(async (req, res, next) => {
    const company = await getCompanyById(req.query.id);
    const stream = getLogoStreamById(company.id);
    stream.on("error", next).pipe(res);
  })
);

app.listen(3000, () => {
  console.log("Start");
});
