'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
 */

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // Every minute
  '* * * * *': () => {
    if (process.env.NODE_ENV === 'production' && process.env.NODE_APP_INSTANCE !== '0') return;

    strapi.services.order.cancelExpiredOrders();
  },
  // Every 5 minutes
  '*/5 * * * *': () => {
    if (process.env.NODE_ENV === 'production' && process.env.NODE_APP_INSTANCE !== '0') return;

    strapi.services.product.fetchMetadataForQueuedProducts();
  },
};
