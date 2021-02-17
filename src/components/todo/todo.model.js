const mongoose = require('mongoose');

const SharedWithSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const TaskSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  checked: {
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

const TodoSchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sharedWith: {
    type: [SharedWithSchema],
    default: undefined,
  },
  title: {
    type: String,
    required: true,
  },
  tasks: {
    type: [TaskSchema],
    default: undefined,
  },
  label: {
    text: {
      type: String,
      required: true,
    },
    colour: {
      type: String,
      required: true,
    },
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
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
  statusChanged: {
    at: {
      type: Date,
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
});

TodoSchema.index({ createdBy: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Todo', TodoSchema);
