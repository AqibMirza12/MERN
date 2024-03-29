const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next(); //unblocking options request
    }
  try {
    const token = req.headers.authorization.split(" ")[1]; //authorisation: bearer token

    if (!token) {
        throw new Error('Authentication failed');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY); //token verification
    req.userData = {userId: decodedToken.userId}; //using req in middleware by adding data to request
    next();
  } catch (error) {
     error = new HttpError('Authentication failed', 403);
    return next(error);
  }
};
