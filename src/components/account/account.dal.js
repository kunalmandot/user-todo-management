const bcrypt = require('bcrypt');

const User = require('./account.model');

const createUser = async (email, password) => {
  const user = new User({
    email,
    password,
  });
  return user.save();
};

const findUserByEmail = async (email) => User.findOne({ email });

const findUserById = async (id) => User.findById(id);

const updateUserPasswordById = async (id, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return User.updateOne(
    { _id: id },
    { $set: { password: hashedPassword, updated: { at: new Date(), by: id } } },
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPasswordById,
};
