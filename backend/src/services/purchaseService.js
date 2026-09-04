const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const Purchase = require('../models/Purchase');
const StockMovement = require('../models/StockMovement');
const { AppError } = require('../middleware/errorHandler');

const list = (companyId, status) => {
  const query = { companyId };
  if (status) query.status = status;
  return Purchase.find(query)
    .populate('supplierId', 'supplierName')
    .populate('items.productId', 'productName productCode quantity')
    .sort({ createdAt: -1 });
};

const create = async (companyId, userId, data) => {
  const supplier = await Supplier.exists({ _id: data.supplierId, companyId, isActive: true });
  if (!supplier) throw new AppError('Supplier not found for this company', 400);

  const productIds = data.items.map((item) => item.productId.toString());
  if (new Set(productIds).size !== productIds.length) throw new AppError('A product may appear only once per purchase', 400);
  const products = await Product.find({ _id: { $in: productIds }, companyId, isActive: true });
  if (products.length !== productIds.length) throw new AppError('One or more products were not found for this company', 400);

  const items = data.items.map((item) => ({
    productId: item.productId,
    quantity: Number(item.quantity),
    costPrice: Number(item.costPrice),
    lineTotal: Number(item.quantity) * Number(item.costPrice)
  }));
  const totalAmount = items.reduce((total, item) => total + item.lineTotal, 0);
  return Purchase.create({ companyId, supplierId: data.supplierId, items, totalAmount, notes: data.notes, createdBy: userId });
};

const receive = async (companyId, purchaseId, userId) => {
  const purchase = await Purchase.findOne({ _id: purchaseId, companyId });
  if (!purchase) throw new AppError('Purchase not found', 404);
  if (purchase.status !== 'PENDING') throw new AppError(`Purchase is already ${purchase.status.toLowerCase()}`, 409);

  const products = await Product.find({
    _id: { $in: purchase.items.map((item) => item.productId) },
    companyId,
    isActive: true
  });
  const productsById = new Map(products.map((product) => [product._id.toString(), product]));
  if (products.length !== purchase.items.length) throw new AppError('A purchase product is no longer available', 409);

  for (const item of purchase.items) {
    const product = productsById.get(item.productId.toString());
    const previousQuantity = product.quantity;
    product.quantity += item.quantity;
    product.purchasePrice = item.costPrice;
    await product.save();
    await StockMovement.create({
      companyId,
      productId: product._id,
      type: 'PURCHASE',
      quantity: item.quantity,
      previousQuantity,
      newQuantity: product.quantity,
      referenceId: purchase._id,
      createdBy: userId,
      notes: `Received purchase ${purchase._id}`
    });
  }

  purchase.status = 'RECEIVED';
  purchase.receivedAt = new Date();
  await purchase.save();
  return Purchase.findById(purchase._id)
    .populate('supplierId', 'supplierName')
    .populate('items.productId', 'productName productCode quantity');
};

module.exports = { list, create, receive };
