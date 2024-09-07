const express = require("express");

const app = express();

const port = 3000;

const server = app.listen(port);

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
  });
});
