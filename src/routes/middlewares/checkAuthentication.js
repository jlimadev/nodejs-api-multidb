const { verify } = require("jsonwebtoken");

const checkAuthentication = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    const error = {
      statusCode: 401,
      error: "Unauthorized",
      message: "JWT token is missing",
    };
    return response.status(error.statusCode).send(error);
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  try {
    verify(token, secret);
    return next();
  } catch (err) {
    const error = {
      statusCode: 401,
      error: "Unauthorized",
      message: "Invalid JWT Token",
    };
    return response.status(error.statusCode).send(error);
  }
};

module.exports = checkAuthentication;
