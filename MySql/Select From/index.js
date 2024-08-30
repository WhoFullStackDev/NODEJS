var mysql = require("mysql2");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "qY&TmN6$7c3vmd",
  database: "mydb",
});

con.connect(function (err) {
  if (err) throw err;
  con.query("SELECT * FROM customers", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    console.log(fields);
  });
});
