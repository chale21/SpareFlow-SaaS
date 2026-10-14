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
    settings: {
      currency: {
        type: String,
        enum: ['ETB', 'USD', 'EUR', 'GBP'],
        default: 'ETB'
      },
      timezone: {
        type: String,
        default: 'Africa/Addis_Ababa',
        maxlength: 100
      },
      dateFormat: {
        type: String,
        enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
        default: 'DD/MM/YYYY'
      },
      lowStockThreshold: {
        type: Number,
        min: 0,
        default: 5
      },
      invoicePrefix: {
        type: String,
        trim: true,
        default: 'INV',
        maxlength: 20
      },
      taxRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 15
      },
      lowStockNotifications: {
        type: Boolean,
        default: true
      },
      emailNotifications: {
        type: Boolean,
        default: true
      }
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

companySchema.pre('validate', function (next) {
  if (typeof this.status === 'string') {
    this.status = this.status.toUpperCase();
  }
  if (typeof this.subscriptionPlan === 'string') {
    this.subscriptionPlan = this.subscriptionPlan.toUpperCase();
  }
  next();
});

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
