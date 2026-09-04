const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    type: { type: String, enum: ['PURCHASE', 'SALE', 'ADJUSTMENT'], required: true },
    quantity: { type: Number, required: true },
    previousQuantity: { type: Number, required: true, min: 0 },
    newQuantity: { type: Number, required: true, min: 0 },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    notes: { type: String, trim: true, maxlength: 500 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

stockMovementSchema.index({ companyId: 1, createdAt: -1 });

module.exports = mongoose.model('StockMovement', stockMovementSchema);
