const mongoose = require('mongoose');

// ============================================================
// SALE ITEM SCHEMA
// ============================================================

const saleItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },

    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
);


// ============================================================
// SALE SCHEMA
// ============================================================

const saleSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },

    customerName: {
      type: String,
      trim: true,
      maxlength: 100
    },

    items: {
      type: [saleItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: 'Sale must contain at least one item'
      }
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    saleDate: {
      type: Date,
      default: Date.now
    },

    paymentMethod: {
      type: String,
      enum: [
        'cash',
        'card',
        'bank_transfer',
        'other'
      ],
      default: 'cash'
    },

    status: {
      type: String,
      enum: [
        'pending',
        'completed',
        'cancelled'
      ],
      default: 'completed'
    },

    notes: {
      type: String,
      trim: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);


// ============================================================
// INDEX
// ============================================================

// Changed "company" to "companyId"
saleSchema.index({
  companyId: 1,
  saleDate: -1
});


// ============================================================
// EXPORT MODEL
// ============================================================

module.exports = mongoose.model(
  'Sale',
  saleSchema
);