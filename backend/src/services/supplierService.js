const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const Purchase = require('../models/Purchase');
const { AppError } = require('../middleware/errorHandler');

const list = (companyId) => Supplier.find({ companyId }).sort({ supplierName: 1 });

const create = async (companyId, data) => Supplier.create({
  companyId,
  supplierName: data.supplierName,
  phone: data.phone,
  email: data.email,
  address: data.address
});

const update = async (companyId, supplierId, data) => {
  const supplier = await Supplier.findOne({ _id: supplierId, companyId });
  if (!supplier) throw new AppError('Supplier not found', 404);

  ['supplierName', 'phone', 'email', 'address', 'isActive'].forEach((field) => {
    if (data[field] !== undefined) supplier[field] = data[field];
  });
  await supplier.save();
  return supplier;
};

const remove = async (companyId, supplierId) => {
  const supplier = await Supplier.findOne({ _id: supplierId, companyId });
  if (!supplier) throw new AppError('Supplier not found', 404);

  const [productCount, purchaseCount] = await Promise.all([
    Product.countDocuments({ companyId, supplierId, isActive: true }),
    Purchase.countDocuments({ companyId, supplierId })
  ]);
  if (productCount || purchaseCount) throw new AppError('Cannot delete a supplier with products or purchases', 409);
  await supplier.deleteOne();
};

const purchases = async (companyId, supplierId) => {
  const supplier = await Supplier.exists({ _id: supplierId, companyId });
  if (!supplier) throw new AppError('Supplier not found', 404);
  return Purchase.find({ companyId, supplierId })
    .populate('items.productId', 'productName productCode')
    .sort({ createdAt: -1 });
};

module.exports = { list, create, update, remove, purchases };
