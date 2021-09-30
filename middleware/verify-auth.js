const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const User = require('../models/User');

const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Token not provided!');
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const { _id } = decoded;
    const user = await User.findById(_id);
    req.user = user;
    next();
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route!');
  }
};

module.exports = verifyAuth;
