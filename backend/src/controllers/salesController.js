const salesService =
  require('../services/salesService');


// ============================================================
// CREATE SALE
// ============================================================

const createSale =
  async (req, res, next) => {

    try {

      const sale =
        await salesService.createSale(

          req.user.companyId,

          req.user.id,

          req.body

        );


      return res.status(201).json({

        success:
          true,

        message:
          'Sale created successfully',

        data:
          sale

      });

    } catch (error) {

      next(error);

    }

  };


// ============================================================
// GET SALES
// ============================================================

const getSales =
  async (req, res, next) => {

    try {

      const sales =
        await salesService.getSales(

          req.user.companyId

        );


      return res.status(200).json({

        success:
          true,

        data:
          sales

      });

    } catch (error) {

      next(error);

    }

  };


// ============================================================
// GET SALES HISTORY
// ============================================================

const getSalesHistory =
  async (req, res, next) => {

    try {

      const sales =
        await salesService.getSalesHistory(

          req.user.companyId

        );


      return res.status(200).json({

        success:
          true,

        data:
          sales

      });

    } catch (error) {

      next(error);

    }

  };


// ============================================================
// GET INVOICE
// ============================================================

const getInvoice =
  async (req, res, next) => {

    try {

      const invoice =
        await salesService.getInvoice(

          req.user.companyId,

          req.params.id

        );


      return res.status(200).json({

        success:
          true,

        data:
          invoice

      });

    } catch (error) {

      next(error);

    }

  };


// ============================================================
// SALES SUMMARY
// ============================================================

const getSalesSummary =
  async (req, res, next) => {

    try {

      const summary =
        await salesService.getSalesSummary(

          req.user.companyId

        );


      return res.status(200).json({

        success:
          true,

        data:
          summary

      });

    } catch (error) {

      next(error);

    }

  };


// ============================================================
// DAILY SALES
// ============================================================

const getDailySales =
  async (req, res, next) => {

    try {

      const sales =
        await salesService.getDailySales(

          req.user.companyId

        );


      return res.status(200).json({

        success:
          true,

        data:
          sales

      });

    } catch (error) {

      next(error);

    }

  };


// ============================================================
// MONTHLY SALES
// ============================================================

const getMonthlySales =
  async (req, res, next) => {

    try {

      const sales =
        await salesService.getMonthlySales(

          req.user.companyId

        );


      return res.status(200).json({

        success:
          true,

        data:
          sales

      });

    } catch (error) {

      next(error);

    }

  };


// ============================================================
// TOP SELLING PRODUCTS
// ============================================================

const getTopProducts =
  async (req, res, next) => {

    try {

      const products =
        await salesService.getTopProducts(

          req.user.companyId

        );


      return res.status(200).json({

        success:
          true,

        data:
          products

      });

    } catch (error) {

      next(error);

    }

  };


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