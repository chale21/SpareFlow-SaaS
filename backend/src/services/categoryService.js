const Category = require('../models/Category');
const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');

const list = (companyId) => Category.find({ companyId }).sort({ categoryName: 1 });

const create = async (companyId, data) => Category.create({
  companyId,
  categoryName: data.categoryName,
  description: data.description
});

const update = async (companyId, categoryId, data) => {
  const category = await Category.findOne({ _id: categoryId, companyId });
  if (!category) throw new AppError('Category not found', 404);

  ['categoryName', 'description', 'isActive'].forEach((field) => {
    if (data[field] !== undefined) category[field] = data[field];
  });
  await category.save();
  return category;
};

const remove = async (companyId, categoryId) => {
  const category = await Category.findOne({ _id: categoryId, companyId });
  if (!category) throw new AppError('Category not found', 404);

  const productCount = await Product.countDocuments({ companyId, categoryId, isActive: true });
  if (productCount > 0) throw new AppError('Cannot delete a category that has products', 409);
  await category.deleteOne();
};

module.exports = { list, create, update, remove };
