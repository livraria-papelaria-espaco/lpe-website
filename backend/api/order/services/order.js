'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  calculateShipping: async (postalCode, shippingMethod, items) => {
    if (shippingMethod === 'STORE_PICKUP') return 0;
    //TODO calculate based on weight and postalcode
    return 4.5;
  },

  cancelExpiredOrders: async () => {
    const expiredOrders = await strapi.services.order.find({
      status: 'WAITING_PAYMENT',
      expiresAt_lte: Date.now(),
    });
    await Promise.all(
      expiredOrders.map(async (order) => {
        try {
          await strapi.services.order.update({ id: order.id }, { status: 'CANCELLED' });
          await Promise.all(
            order.orderData.items.map(async (item) => {
              if (item.needsRestock - item.quantity === 0) return;
              await strapi.services.product
                .decreaseStock({ id: item.id, qnt: item.needsRestock - item.quantity })
                .catch((e) => {
                  strapi.log.error(
                    { error: e, items, order },
                    '[Order Cancel] Failed to increase stock for %s by %d',
                    item.id,
                    item.quantity - item.needsRestock
                  );
                  throw e;
                });
            })
          );

          try {
            strapi.services.email.sendOrderCancelledEmail({
              order,
              user: order.user,
            });
          } catch (e) {
            strapi.log.error(
              { error: e },
              `Failed to send order cancelled email for order ${entity.invoiceId}: ${JSON.stringify(
                e
              )}`
            );
          }
        } catch (e) {
          strapi.log.error(
            { error: e, order },
            '[Order Cancel] Failed to change order status for #%s',
            order.invoiceId
          );
        }
      })
    );
  },
};
