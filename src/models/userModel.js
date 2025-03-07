const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {ROLES} = require('../utils/user');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'Invalid email address',
      },
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
    },
    prayers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prayers',
    },
  },
  {timestamps: true}
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.index({
  unique: true,
  name: `email_unique_index`,
  partialFilterExpression: {isActive: false},
  email: 1,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
