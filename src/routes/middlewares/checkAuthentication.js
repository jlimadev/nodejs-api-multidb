import { verify } from 'jsonwebtoken';

const checkAuthentication = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.send('JWT token is missing').status(401);
  }

  const secret = process.env.JWT_SECRET;

  try {
    verify(token, secret);
    return next();
  } catch {
    response.send('Invalid JWT Token').status(401);
  }
};

module.exports = checkAuthentication;
