const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [8, 'Password should contain at least 8 characters.'],
    maxLength: [16, 'Password should contain at most 16 characters.'],
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  isSuperAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated: {
    at: {
      type: Date,
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
});

// eslint-disable-next-line func-names
UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);
