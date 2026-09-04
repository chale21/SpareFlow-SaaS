const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 150
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
    contactName: {
      type: String,
      trim: true,
      maxlength: 120
    },
    contactPhone: {
      type: String,
      trim: true,
      maxlength: 30
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150
    },
    address: {
      type: String,
      trim: true,
      maxlength: 300
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED'],
      default: 'PENDING'
    },
    subscriptionPlan: {
      type: String,
      enum: ['FREE', 'STANDARD', 'PREMIUM', 'ENTERPRISE'],
      default: 'STANDARD'
    },
    website: {
      type: String,
      trim: true,
      maxlength: 200
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

companySchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }
  next();
});

module.exports = mongoose.model('Company', companySchema);
