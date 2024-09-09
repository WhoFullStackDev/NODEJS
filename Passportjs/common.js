exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};
