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

const updateUserPasswordById = async (id, password) => User.updateOne(
  { _id: id },
  { $set: { password, updated: { at: new Date(), by: id } } },
);

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPasswordById,
};
