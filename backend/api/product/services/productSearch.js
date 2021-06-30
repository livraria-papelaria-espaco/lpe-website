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
  'category',
];

const extractCategory = (product) => ({
  ...product,
  category: product.category && product.category._id,
});

const updateProduct = async (product) => {
  if (product.show) {
    await meili.index('product').addDocuments([_.pick(extractCategory(product), PUBLIC_FIELDS)]);
  } else {
    await deleteProduct(product);
  }
};

const partialUpdateProduct = async (product) => {
  if (product.show === false) {
    await deleteProduct(product);
  } else {
    await meili.index('product').updateDocuments([_.pick(extractCategory(product), PUBLIC_FIELDS)]);
  }
};

const deleteProduct = async (product) => {
  try {
    await meili.index('product').deleteDocument(product._id);
  } catch (e) {
    console.error(e);
    console.error('Failed to delete product from meilisearch');
  }
};

const searchProduct = (query, properties) => meili.index('product').search(query, properties);

module.exports = {
  updateProduct,
  partialUpdateProduct,
  deleteProduct,
  searchProduct,
};
