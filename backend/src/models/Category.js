const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    categoryName: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

categorySchema.index({ companyId: 1, categoryName: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
