'use strict';

/**
 * metadata-fetcher.js controller
 *
 * @description: A set of functions called "actions" of the `metadata-fetcher` plugin.
 */

const crypto = require('crypto');
const uuid = require('uuid/v4');

function niceHash(buffer) {
  return crypto
    .createHash('sha256')
    .update(buffer)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\//g, '-')
    .replace(/\+/, '_');
}

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.

    // Send 200 `ok`
    ctx.send({
      message: 'ok',
    });
  },

  fetchBook: async (ctx) => {
    const { isbn, forceImages = 'false' } = ctx.query;

    const { fetchMetadataFromWook, fetchAndUploadImages, isISBN } = strapi.plugins[
      'metadata-fetcher'
    ].services['metadata-fetcher'];

    ctx.assert(isISBN(isbn), 400, 'invalid isbn');
    ctx.assert(
      forceImages === 'true' || forceImages === 'false',
      400,
      "forceImages must be either 'true' or 'false'"
    );

    let product = await strapi.services.product.findOne({ reference: isbn });
    const isNewProduct = !product;
    if (isNewProduct) {
      product = {
        reference: isbn,
        show: false,
        price: 0,
        quantity: 0,
        stockStatus: 'IN_STOCK',
        type: 'Livro',
        orderAvailable: true,
        weight: 0,
      };
    }

    const metadata = await fetchMetadataFromWook(isbn);
    ctx.assert(!!metadata, 502, 'metadata not found on external services');

    product = { ...product, ...metadata };

    if (!product.slug) {
      product = {
        ...product,
        slug: await strapi.plugins['content-manager'].services.uid.generateUIDField({
          contentTypeUID: 'application::product.product',
          field: 'slug',
          data: product,
        }),
      };
    }

    const contentManagerService = strapi.plugins['content-manager'].services.contentmanager;

    let result;

    try {
      if (!product.images || forceImages === 'true') {
        product = {
          ...product,
          images: await fetchAndUploadImages(isbn, product.slug),
        };
      }
      if (isNewProduct) {
        result = await contentManagerService.create(product, {
          model: 'application::product.product',
        });
      } else {
        result = await contentManagerService.edit({ id: product.id }, product, {
          model: 'application::product.product',
        });
      }
    } catch (e) {
      console.error(e);
      ctx.throw(500, 'failed to create/update product');
    }

    ctx.send({
      message: 'ok',
      id: result.id,
    });
  },
};
