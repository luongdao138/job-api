const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name cannot be empty!'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Email cannot be empty!'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Invalid email!',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password cannot be empty!'],
  },
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePw = async function (password) {
  const isPwValid = bcrypt.compare(password, this.password);
  return isPwValid;
};

module.exports = model('User', UserSchema);
