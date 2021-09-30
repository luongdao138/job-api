const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

module.exports = {
  register: async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    const returnUser = { ...user._doc };
    delete returnUser.password;
    return res.status(StatusCodes.CREATED).json({ returnUser, token });
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError('Email or password is not correct!');
    }
    const isPwValid = await user.comparePw(password);
    if (!isPwValid) {
      throw new UnauthenticatedError('Email or password is not correct!');
    }

    const token = user.createJWT();
    const returnUser = { ...user._doc };
    delete returnUser.password;
    return res.status(StatusCodes.OK).json({ returnUser, token });
  },
};
