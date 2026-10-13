const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
      index: true
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: [
        'LOW_STOCK',
        'OUT_OF_STOCK',
        'NEW_COMPANY',
        'PURCHASE_CREATED',
        'PURCHASE_COMPLETED',
        'SALE_COMPLETED',
        'NEW_STAFF'
      ],
      required: true
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    link: { type: String, default: null, maxlength: 300 },
    resourceType: { type: String, default: null, maxlength: 40 },
    resourceId: { type: mongoose.Schema.Types.ObjectId, default: null },
    dedupeKey: { type: String, required: true, maxlength: 200 },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date, default: null }
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, dedupeKey: 1 }, { unique: true });
notificationSchema.index({ recipientId: 1, companyId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
