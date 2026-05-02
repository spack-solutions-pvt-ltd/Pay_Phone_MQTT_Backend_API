
const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, type) => {
  return jwt.sign(
    {
      id: userId,
      type,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30m",
    }
  );
};

module.exports = { generateAccessToken };