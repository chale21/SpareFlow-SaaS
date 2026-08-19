const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const { AppError } = require('../middleware/errorHandler');

const productQuery = (companyId, filters = {}) => {
  const query = { companyId, isActive: true };
  if (filters.categoryId) query.categoryId = filters.categoryId;
  if (filters.q) query.$or = [
    { productName: { $regex: filters.q, $options: 'i' } },
    { productCode: { $regex: filters.q, $options: 'i' } }
  ];
  if (filters.lowStock === 'true') query.$expr = { $lte: ['$quantity', '$minimumStock'] };
  if (filters.outOfStock === 'true') query.quantity = 0;
  return query;
};

const ensureReferences = async (companyId, categoryId, supplierId) => {
  const [category, supplier] = await Promise.all([
    Category.exists({ _id: categoryId, companyId, isActive: true }),
    Supplier.exists({ _id: supplierId, companyId, isActive: true })
  ]);
  if (!category) throw new AppError('Category not found for this company', 400);
  if (!supplier) throw new AppError('Supplier not found for this company', 400);
};

const list = (companyId, filters) => Product.find(productQuery(companyId, filters))
  .populate('categoryId', 'categoryName')
  .populate('supplierId', 'supplierName')
  .sort({ productName: 1 });

const get = async (companyId, productId) => {
  const product = await Product.findOne({ _id: productId, companyId, isActive: true })
    .populate('categoryId', 'categoryName')
    .populate('supplierId', 'supplierName');
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

const create = async (companyId, data) => {
  await ensureReferences(companyId, data.categoryId, data.supplierId);
  return Product.create({
    companyId,
    productName: data.productName,
    categoryId: data.categoryId,
    productCode: data.productCode,
    quantity: data.quantity,
    purchasePrice: data.purchasePrice,
    sellingPrice: data.sellingPrice,
    minimumStock: data.minimumStock,
    maximumStock: data.maximumStock,
    supplierId: data.supplierId
  });
};

const update = async (companyId, productId, data, userId) => {
  const product = await Product.findOne({ _id: productId, companyId, isActive: true });
  if (!product) throw new AppError('Product not found', 404);
  if (data.categoryId || data.supplierId) {
    await ensureReferences(companyId, data.categoryId || product.categoryId, data.supplierId || product.supplierId);
  }

  const previousQuantity = product.quantity;
  ['productName', 'categoryId', 'productCode', 'purchasePrice', 'sellingPrice', 'minimumStock', 'maximumStock'].forEach((field) => {
    if (data[field] !== undefined) product[field] = data[field];
  });
  if (data.quantity !== undefined) product.quantity = data.quantity;
  await product.save();

  if (data.quantity !== undefined && data.quantity !== previousQuantity) {
    await StockMovement.create({
      companyId,
      productId: product._id,
      type: 'ADJUSTMENT',
      quantity: data.quantity - previousQuantity,
      previousQuantity,
      newQuantity: data.quantity,
      createdBy: userId,
      notes: 'Manual inventory adjustment'
    });
  }
  return get(companyId, productId);
};

const remove = async (companyId, productId) => {
  const product = await Product.findOne({ _id: productId, companyId, isActive: true });
  if (!product) throw new AppError('Product not found', 404);
  product.isActive = false;
  await product.save();
};

const movements = async (companyId, productId) => {
  await get(companyId, productId);
  return StockMovement.find({ companyId, productId }).sort({ createdAt: -1 });
};

module.exports = { list, get, create, update, remove, movements };
