const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    supplierName: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, trim: true, lowercase: true, maxlength: 150 },
    address: { type: String, trim: true, maxlength: 200 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

supplierSchema.index({ companyId: 1, supplierName: 1 }, { unique: true });

module.exports = mongoose.model('Supplier', supplierSchema);
