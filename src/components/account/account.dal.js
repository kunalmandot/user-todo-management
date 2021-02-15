const User = require('./account.model');

const createUser = async (email, password) => {
  const user = new User({
    email,
    password,
  });
  return user.save();
};

const findUserByEmail = async (email) => User.findOne({ email });

module.exports = {
  createUser,
  findUserByEmail,
};
