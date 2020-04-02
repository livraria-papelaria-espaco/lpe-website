'use strict';

/**
 * OrderManagement.js controller
 *
 * @description: A set of functions called "actions" of the `order-management` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  nextstep: async (ctx) => {
    const { id } = ctx.params;
    const { status, nextStatus } = ctx.query;

    ctx.assert(id, 400, 'invalid id');
    ctx.assert(status, 400, 'invalid status');

    const orderService = strapi.plugins['order-management'].services.ordermanagement;

    const order = await orderService.fetch({ id });

    ctx.assert(
      order.status === status,
      412,
      `order status (${order.status}) doesn't match with provided status (${status})`
    );

    let finalStatus;

    switch (status) {
      case 'DELIVERY_FAILED':
      case 'PROCESSING':
      case 'WAITING_ITEMS':
        let sendEmail;
        if (status === 'PROCESSING' && nextStatus === 'WAITING_ITEMS') {
          finalStatus = 'WAITING_ITEMS';
        } else if (order.shippingMethod === 'STORE_PICKUP') {
          finalStatus = 'READY_TO_PICKUP';
          sendEmail = strapi.services.email.sendOrderReadyToPickupEmail;
        } else {
          finalStatus = 'SHIPPED';
          sendEmail = strapi.services.email.sendOrderShippedEmail;
        }

        try {
          if (sendEmail)
            sendEmail({
              order: { ...order, status: finalStatus },
              user: order.user,
            });
        } catch (e) {
          strapi.log.error(
            `Failed to send order update email for order ${order.invoiceId}: ${JSON.stringify(e)}`
          );
        }

        break;
      case 'READY_TO_PICKUP':
        finalStatus = 'DELIVERED';
    }

    ctx.assert(finalStatus, 409, "the current status of the order doesn't allow for a next step");

    ctx.send(await orderService.update({ id }, { status: finalStatus }));
  },

  updateRestockCount: async (ctx) => {
    const { id } = ctx.params;
    const { id: itemId, count } = ctx.request.body;

    ctx.assert(id, 400, 'invalid id');
    ctx.assert(itemId, 400, 'invalid item id');
    ctx.assert(Number.isSafeInteger(count), 400, 'invalid item count');

    const orderService = strapi.plugins['order-management'].services.ordermanagement;

    const order = await orderService.fetch({ id });

    ctx.assert(!!order, 404, 'order not found');

    ctx.send(
      await orderService.update(
        { id },
        {
          orderData: {
            ...order.orderData,
            items: order.orderData.items.map((v) =>
              v.id !== itemId || count > v.quantity ? v : { ...v, needsRestock: count }
            ),
          },
        }
      )
    );
  },
};
