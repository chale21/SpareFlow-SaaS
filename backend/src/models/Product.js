const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    productName: { type: String, required: true, trim: true, maxlength: 200 },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    productCode: { type: String, required: true, trim: true, uppercase: true, maxlength: 50 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    purchasePrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    minimumStock: { type: Number, required: true, min: 0, default: 0 },
    maximumStock: { type: Number, min: 0 },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index({ companyId: 1, productCode: 1 }, { unique: true });
productSchema.index({ companyId: 1, productName: 1 });

module.exports = mongoose.model('Product', productSchema);
