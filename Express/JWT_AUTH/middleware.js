const jwt = require("jsonwebtoken");

const secret = "HelloWorld";

const verfiy = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      res.status(400).json({ message: "unAuhthection" });
    }
    const data = jwt.verify(token, secret);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = verfiy;
