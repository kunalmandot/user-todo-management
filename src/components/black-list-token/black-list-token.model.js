const mongoose = require('mongoose');

const BlackListTokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('BlackListToken', BlackListTokenSchema);
