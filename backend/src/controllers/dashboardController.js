const dashboardService =
  require(
    '../services/dashboardService'
  );


// ============================================================
// DASHBOARD STATISTICS
// ============================================================

const getStats =
  async (req, res, next) => {

    try {

      const stats =
        await dashboardService.getDashboardStats(

          req.user.companyId

        );


      return res.status(200).json({

        success:
          true,

        data:
          stats

      });

    } catch (error) {

      next(error);

    }

  };


// ============================================================
// RECENT ACTIVITIES
// ============================================================

const getRecentActivities =
  async (req, res, next) => {

    try {

      const activities =
        await dashboardService.getRecentActivities(

          req.user.companyId

        );


      return res.status(200).json({

        success:
          true,

        data:
          activities

      });

    } catch (error) {

      next(error);

    }

  };


module.exports = {

  getStats,

  getRecentActivities

};