const jwt = require("jsonwebtoken");

exports.tokenVerfiyMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token not found",
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "token invalide, somthing worng in token verfcation",
    });
  }
};
