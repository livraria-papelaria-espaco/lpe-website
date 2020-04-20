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

const isISBN = (isbn) => {
  if (!isbn || isbn.length !== 13 || !isbn.startsWith('978')) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    let digit = parseInt(isbn[i]);
    if (i % 2 == 1) sum += 3 * digit;
    else sum += digit;
  }
  const check = (10 - (sum % 10)) % 10;
  return check == isbn[isbn.length - 1];
};

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

    const { fetchMetadataFromWook, fetchImagesFromFnac } = strapi.plugins[
      'metadata-fetcher'
    ].services['metadata-fetcher'];

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
        const images = await fetchImagesFromFnac(isbn);

        const uploadService = strapi.plugins['upload'].services.upload;
        const uploadConfig = await strapi
          .store({
            environment: strapi.config.environment,
            type: 'plugin',
            name: 'upload',
          })
          .get({ key: 'provider' });

        product = {
          ...product,
          images: await uploadService.upload(
            images.map((buffer, i) => ({
              name: `${product.slug}-${i}.jpg`,
              sha256: niceHash(buffer),
              hash: uuid().replace(/-/g, ''),
              ext: `.jpg`,
              buffer,
              mime: 'image/jpeg',
              size: (buffer.length / 1000).toFixed(2),
            })),
            uploadConfig
          ),
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
    } catch {
      ctx.throw(500, 'failed to create/update product');
    }

    ctx.send({
      message: 'ok',
      id: result.id,
    });
  },
};
