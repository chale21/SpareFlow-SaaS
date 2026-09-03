const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

const { AppError } = require('../middleware/errorHandler');


// ============================================================
// CREATE SALE
// ============================================================

const createSale = async (
  companyId,
  userId,
  data
) => {

  if (
    !data.items ||
    !Array.isArray(data.items) ||
    data.items.length === 0
  ) {
    throw new AppError(
      'Sale must contain at least one item',
      400
    );
  }


  // Request uses productId
  const productIds = data.items.map(
    (item) => item.productId.toString()
  );


  // Prevent duplicate products
  const uniqueProductIds = new Set(productIds);

  if (
    uniqueProductIds.size !== productIds.length
  ) {
    throw new AppError(
      'A product may appear only once in a sale',
      400
    );
  }


  // Get products
  const products = await Product.find({
    _id: {
      $in: productIds
    },

    companyId,

    isActive: true
  });


  if (
    products.length !== productIds.length
  ) {
    throw new AppError(
      'One or more products were not found for this company',
      404
    );
  }


  // Create product lookup map
  const productsById = new Map(
    products.map(
      (product) => [
        product._id.toString(),
        product
      ]
    )
  );


  const saleItems = [];


  // ==========================================================
  // VALIDATE STOCK AND CREATE SALE ITEMS
  // ==========================================================

  for (
    const item of data.items
  ) {

    const quantity = Number(
      item.quantity
    );


    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      throw new AppError(
        'Sale quantity must be greater than zero',
        400
      );
    }


    // Request still uses productId
    const product =
      productsById.get(
        item.productId.toString()
      );


    if (!product) {
      throw new AppError(
        'Product not found',
        404
      );
    }


    // Check stock
    if (
      product.quantity < quantity
    ) {
      throw new AppError(
        `Insufficient stock for ${product.productName}. Available quantity: ${product.quantity}`,
        400
      );
    }


    // Get price from database
    const unitPrice =
      product.sellingPrice;


    const total =
      unitPrice * quantity;


    // Database Sale model uses "product"
    saleItems.push({

      product:
        product._id,

      quantity,

      unitPrice,

      total

    });

  }


  // ==========================================================
  // CALCULATE TOTAL
  // ==========================================================

  const totalAmount =
    saleItems.reduce(
      (total, item) =>
        total + item.total,
      0
    );


  // ==========================================================
  // CREATE SALE
  // ==========================================================

  const sale =
    await Sale.create({

      companyId,

      customerName:
        data.customerName,

      items:
        saleItems,

      totalAmount,

      paymentMethod:
        data.paymentMethod ||
        'cash',

      notes:
        data.notes,

      createdBy:
        userId,

      status:
        'completed'

    });


  // ==========================================================
  // REDUCE STOCK AND CREATE STOCK MOVEMENTS
  // ==========================================================

  for (
    const item of saleItems
  ) {

    // Sale item uses product
    const product =
      productsById.get(
        item.product.toString()
      );


    const previousQuantity =
      product.quantity;


    // Reduce stock
    product.quantity =
      product.quantity -
      item.quantity;


    await product.save();


    // Create stock movement
    await StockMovement.create({

      companyId,

      productId:
        product._id,

      type:
        'SALE',

      quantity:
        item.quantity,

      previousQuantity,

      newQuantity:
        product.quantity,

      referenceId:
        sale._id,

      createdBy:
        userId,

      notes:
        `Sale ${sale._id}`

    });

  }


  // ==========================================================
  // RETURN POPULATED SALE
  // ==========================================================

  return Sale.findById(
    sale._id
  )

    .populate(
      'items.product',
      'productName productCode sellingPrice'
    )

    .populate(
      'createdBy',
      'name email'
    );

};


// ============================================================
// GET SALES
// ============================================================

const getSales = async (
  companyId
) => {

  return Sale.find({
    companyId
  })

    .populate(
      'items.product',
      'productName productCode'
    )

    .populate(
      'createdBy',
      'name email'
    )

    .sort({
      saleDate: -1
    });

};


// ============================================================
// GET SALES HISTORY
// ============================================================

const getSalesHistory = async (
  companyId
) => {

  return Sale.find({

    companyId,

    status:
      'completed'

  })

    .populate(
      'items.product',
      'productName productCode'
    )

    .populate(
      'createdBy',
      'name email'
    )

    .sort({
      saleDate: -1
    });

};


// ============================================================
// GET INVOICE
// ============================================================

const getInvoice = async (
  companyId,
  saleId
) => {

  const sale =
    await Sale.findOne({

      _id:
        saleId,

      companyId

    })

      .populate(
        'companyId',
        'name email phone address'
      )

      .populate(
        'items.product',
        'productName productCode'
      )

      .populate(
        'createdBy',
        'name email'
      );


  if (!sale) {

    throw new AppError(
      'Sale not found',
      404
    );

  }


  return {

    invoiceNumber:
      `SALE-${sale._id.toString().slice(-8).toUpperCase()}`,

    saleId:
      sale._id,

    saleDate:
      sale.saleDate,

    company:
      sale.companyId,

    customerName:
      sale.customerName,

    items:
      sale.items.map(
        (item) => ({

          product:
            item.product
              ?.productName,

          productCode:
            item.product
              ?.productCode,

          quantity:
            item.quantity,

          unitPrice:
            item.unitPrice,

          total:
            item.total

        })
      ),

    totalAmount:
      sale.totalAmount,

    paymentMethod:
      sale.paymentMethod,

    status:
      sale.status,

    notes:
      sale.notes,

    createdBy:
      sale.createdBy

  };

};


// ============================================================
// SALES ANALYTICS SUMMARY
// ============================================================

const getSalesSummary = async (
  companyId
) => {

  const companyObjectId =
    new mongoose.Types.ObjectId(
      companyId
    );


  const result =
    await Sale.aggregate([

      {
        $match: {

          companyId:
            companyObjectId,

          status:
            'completed'

        }
      },

      {
        $group: {

          _id:
            null,

          totalSales:
            {
              $sum: 1
            },

          totalRevenue:
            {
              $sum:
                '$totalAmount'
            },

          averageSaleAmount:
            {
              $avg:
                '$totalAmount'
            }

        }
      }

    ]);


  return result[0] || {

    totalSales:
      0,

    totalRevenue:
      0,

    averageSaleAmount:
      0

  };

};


// ============================================================
// DAILY SALES ANALYTICS
// ============================================================

const getDailySales = async (
  companyId
) => {

  const companyObjectId =
    new mongoose.Types.ObjectId(
      companyId
    );


  return Sale.aggregate([

    {
      $match: {

        companyId:
          companyObjectId,

        status:
          'completed'

      }
    },

    {
      $group: {

        _id: {

          year:
            {
              $year:
                '$saleDate'
            },

          month:
            {
              $month:
                '$saleDate'
            },

          day:
            {
              $dayOfMonth:
                '$saleDate'
            }

        },

        totalSales:
          {
            $sum: 1
          },

        totalRevenue:
          {
            $sum:
              '$totalAmount'
          }

      }
    },

    {
      $sort: {

        '_id.year':
          -1,

        '_id.month':
          -1,

        '_id.day':
          -1

      }
    }

  ]);

};


// ============================================================
// MONTHLY SALES ANALYTICS
// ============================================================

const getMonthlySales = async (
  companyId
) => {

  const companyObjectId =
    new mongoose.Types.ObjectId(
      companyId
    );


  return Sale.aggregate([

    {
      $match: {

        companyId:
          companyObjectId,

        status:
          'completed'

      }
    },

    {
      $group: {

        _id: {

          year:
            {
              $year:
                '$saleDate'
            },

          month:
            {
              $month:
                '$saleDate'
            }

        },

        totalSales:
          {
            $sum: 1
          },

        totalRevenue:
          {
            $sum:
              '$totalAmount'
          }

      }
    },

    {
      $sort: {

        '_id.year':
          -1,

        '_id.month':
          -1

      }
    }

  ]);

};


// ============================================================
// TOP SELLING PRODUCTS
// ============================================================

const getTopProducts = async (
  companyId
) => {

  const companyObjectId =
    new mongoose.Types.ObjectId(
      companyId
    );


  return Sale.aggregate([

    {
      $match: {

        companyId:
          companyObjectId,

        status:
          'completed'

      }
    },

    {
      $unwind:
        '$items'
    },

    {
      $group: {

        _id:
          '$items.product',

        totalQuantitySold:
          {
            $sum:
              '$items.quantity'
          },

        totalRevenue:
          {
            $sum:
              '$items.total'
          }

      }
    },

    {
      $sort: {

        totalQuantitySold:
          -1

      }
    },

    {
      $limit:
        10
    },

    {
      $lookup: {

        from:
          'products',

        localField:
          '_id',

        foreignField:
          '_id',

        as:
          'product'

      }
    },

    {
      $unwind:
        '$product'
    },

    {
      $project: {

        _id:
          0,

        productId:
          '$_id',

        productName:
          '$product.productName',

        productCode:
          '$product.productCode',

        totalQuantitySold:
          1,

        totalRevenue:
          1

      }
    }

  ]);

};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

  createSale,

  getSales,

  getSalesHistory,

  getInvoice,

  getSalesSummary,

  getDailySales,

  getMonthlySales,

  getTopProducts

};