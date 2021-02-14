const User = require('./account.model');

const createUser = async (email, password) => {
  const user = new User({
    email,
    password,
  });
  const savedUser = await user.save();
  return savedUser;
};

module.exports = {
  createUser,
};
