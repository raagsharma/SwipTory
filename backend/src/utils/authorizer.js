const { expressjwt } = require("express-jwt");

const authorizer = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: true,
});

const leanAuthroizer = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false,
});

module.exports = {
  authorizer,
  leanAuthroizer,
};
