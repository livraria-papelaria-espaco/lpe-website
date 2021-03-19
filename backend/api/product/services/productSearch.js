const { MeiliSearch } = require('meilisearch');
const _ = require('lodash');

const meili = new MeiliSearch({
  host: strapi.config.get('custom.meiliHost', 'http://127.0.0.1:7700'),
  apiKey: strapi.config.get('custom.meiliApiKey', ''),
});

const PUBLIC_FIELDS = [
  '_id',
  'slug',
  'stockStatus',
  'language',
  'publishedDate',
  'bookPages',
  'bookPublisher',
  'bookEdition',
  'bookAuthor',
  'reference',
  'price',
  'description',
  'name',
  'createdAt',
  'updatedAt',
];

const updateProduct = async (product) => {
  if (product.show) {
    await meili.index('product').addDocuments([_.pick(product, PUBLIC_FIELDS)]);
  } else {
    await deleteProduct(product);
  }
};

const partialUpdateProduct = async (product) => {
  if (product.show === false) {
    await deleteProduct(product);
  } else {
    await meili.index('product').updateDocuments([_.pick(product, PUBLIC_FIELDS)]);
  }
};

const deleteProduct = async (product) => {
  await meili.index('product').deleteDocument(product._id);
};

module.exports = {
  updateProduct,
  partialUpdateProduct,
  deleteProduct,
};
