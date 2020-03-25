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
};
