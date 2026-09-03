const Sale =
  require('../models/Sale');

const Product =
  require('../models/Product');

const Purchase =
  require('../models/Purchase');

const StockMovement =
  require('../models/StockMovement');


// ============================================================
// DASHBOARD STATISTICS
// ============================================================

const getDashboardStats =
  async (companyId) => {

    const [

      salesResult,

      totalProducts,

      lowStockProducts,

      recentSales

    ] = await Promise.all([


      // ------------------------------------------------------
      // SALES STATISTICS
      // ------------------------------------------------------

      Sale.aggregate([

        {

          $match: {

            companyId,

            status:
              'COMPLETED'

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
              }

          }

        }

      ]),


      // ------------------------------------------------------
      // TOTAL PRODUCTS
      // ------------------------------------------------------

      Product.countDocuments({

        companyId,

        isActive:
          true

      }),


      // ------------------------------------------------------
      // LOW STOCK PRODUCTS
      // ------------------------------------------------------

      Product.countDocuments({

        companyId,

        isActive:
          true,

        $expr: {

          $lte: [

            '$quantity',

            '$minimumStock'

          ]

        }

      }),


      // ------------------------------------------------------
      // RECENT SALES COUNT
      // ------------------------------------------------------

      Sale.countDocuments({

        companyId,

        status:
          'COMPLETED'

      })

    ]);


    const salesData =
      salesResult[0] || {

        totalSales:
          0,

        totalRevenue:
          0

      };


    return {

      totalSales:
        salesData.totalSales,

      totalRevenue:
        salesData.totalRevenue,

      totalProducts,

      lowStockProducts,

      recentSales

    };

  };


// ============================================================
// RECENT ACTIVITIES
// ============================================================

const getRecentActivities =
  async (companyId) => {

    const [

      recentSales,

      recentPurchases,

      recentStockMovements

    ] = await Promise.all([


      Sale.find({

        companyId

      })

        .populate(
          'createdBy',
          'name'
        )

        .sort({

          createdAt:
            -1

        })

        .limit(5),


      Purchase.find({

        companyId

      })

        .sort({

          createdAt:
            -1

        })

        .limit(5),


      StockMovement.find({

        companyId

      })

        .populate(

          'productId',

          'productName productCode'

        )

        .sort({

          createdAt:
            -1

        })

        .limit(5)

    ]);


    const activities =
      [];


    // --------------------------------------------------------
    // SALES ACTIVITIES
    // --------------------------------------------------------

    recentSales.forEach(

      (sale) => {

        activities.push({

          type:
            'SALE',

          description:
            `Sale completed for ${sale.totalAmount}`,

          referenceId:
            sale._id,

          date:
            sale.createdAt

        });

      }

    );


    // --------------------------------------------------------
    // PURCHASE ACTIVITIES
    // --------------------------------------------------------

    recentPurchases.forEach(

      (purchase) => {

        activities.push({

          type:
            'PURCHASE',

          description:
            `Purchase created`,

          referenceId:
            purchase._id,

          date:
            purchase.createdAt

        });

      }

    );


    // --------------------------------------------------------
    // STOCK ACTIVITIES
    // --------------------------------------------------------

    recentStockMovements.forEach(

      (movement) => {

        activities.push({

          type:
            movement.type,

          description:
            `${movement.type} stock movement`,

          product:
            movement.productId,

          referenceId:
            movement.referenceId,

          date:
            movement.createdAt

        });

      }

    );


    // --------------------------------------------------------
    // SORT ALL ACTIVITIES
    // --------------------------------------------------------

    activities.sort(

      (a, b) =>

        new Date(
          b.date
        ) -

        new Date(
          a.date
        )

    );


    return activities.slice(
      0,
      10
    );

  };


module.exports = {

  getDashboardStats,

  getRecentActivities

};