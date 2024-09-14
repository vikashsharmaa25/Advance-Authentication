const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = generateToken;
