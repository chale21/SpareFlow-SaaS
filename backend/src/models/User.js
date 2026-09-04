const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },

    // Keep both names for compatibility with existing code.
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },

    fullName: {
      type: String,
      trim: true,
      maxlength: 120
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 150
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'SHOP_OWNER', 'STAFF'],
      default: 'STAFF'
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'ACTIVE'
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: {
      type: Date,
      default: null
    },

    passwordChangedAt: {
      type: Date,
      default: null
    },

    passwordResetTokenHash: {
      type: String,
      default: null,
      select: false
    },

    passwordResetExpires: {
      type: Date,
      default: null,
      select: false
    },

    avatar: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);


// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
  } catch (error) {
    next(error);
  }
});


// Compare a plain password with the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


// Clear password reset information
userSchema.methods.clearPasswordReset = function () {
  this.passwordResetTokenHash = null;
  this.passwordResetExpires = null;
};


module.exports = mongoose.model('User', userSchema);