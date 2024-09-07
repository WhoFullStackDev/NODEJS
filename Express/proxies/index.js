const express = require("express");

const app = express();

app.set("trust proxy", "loopback"); // specify a single subnet
app.set("trust proxy", "loopback, 123.123.123.123"); // specify a subnet and an address
app.set("trust proxy", "loopback, linklocal, uniquelocal"); // specify multiple subnets as CSV
app.set("trust proxy", ["loopback", "linklocal", "uniquelocal"]);
app.set("trust proxy", (ip) => {
  if (ip === "127.0.0.1" || ip === "123.123.123.123")
    return true; // trusted IPs
  else return false;
});

app.listen(3000, () => {
  console.log("start");
});
