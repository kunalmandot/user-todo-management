const { signupSchema } = require('./account.validation');
const { createUser } = require('./account.dal');

const signup = async (req, res, next) => {
  try {
    const result = await signupSchema.validateAsync(req.body);

    const user = await createUser(result.email, result.password);
    if (user) {
      return res.status(201).json({ msg: 'Signed up successfully.' });
    }
    return next();
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(422).json({ msg: err.message });
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({ msg: 'Email already taken.' });
    }
    return next();
  }
};

module.exports = {
  signup,
};
