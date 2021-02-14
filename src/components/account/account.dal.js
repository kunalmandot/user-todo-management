const User = require('./account.model');

const createUser = async (email, password) => {
  const user = new User({
    email,
    password,
  });
  return user.save();
};

const findByEmail = async (email) => User.findOne({ email });

module.exports = {
  createUser,
  findByEmail,
};
