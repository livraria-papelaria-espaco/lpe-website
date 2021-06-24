const { MeiliSearch } = require('meilisearch');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

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

const createStrapiApp = async (projectPath) => {
  if (!projectPath) {
    throw new Error(`
-> Path to strapi project is missing.
-> Usage: node meilisearch.js [path]`);
  }

  let strapi;
  let app;
  try {
    strapi = require(require.resolve('strapi', { paths: [projectPath] }));
    const pkgJSON = require(path.resolve(projectPath, 'package.json'));
    if (!pkgJSON || !pkgJSON.dependencies || !pkgJSON.dependencies.strapi) {
      throw new Error();
    }
  } catch (e) {
    throw new Error(`
-> Strapi lib couldn\'t be found. Are the node_modules installed?
-> Fix: yarn install or npm install`);
  }

  try {
    app = await strapi({ dir: projectPath }).load();
  } catch (e) {
    throw new Error(`
-> The migration couldn't be proceed because Strapi app couldn't start.
-> ${e.message}`);
  }

  return app;
};

const extractCategory = (product) => ({
  ...product,
  category: product.category && product.category._id,
});

const run = async () => {
  const projectPath = process.argv[2];
  const app = await createStrapiApp(projectPath);

  const meili = new MeiliSearch({
    host: app.config.get('custom.meiliHost', 'http://127.0.0.1:7700'),
    apiKey: app.config.get('custom.meiliApiKey', ''),
  });

  const index = meili.index('product');

  try {
    await index.deleteAllDocuments();
  } catch (e) {
    // Ignore
  }

  const count = await app.services.product.count();
  let products;
  let i = 0;
  while (i < count) {
    products = await app.services.product.find({ _start: i });
    i += products.length;
    await index.addDocuments(
      products
        .filter((prod) => prod.show)
        .map((prod) => _.pick(extractCategory(prod), PUBLIC_FIELDS))
    );
  }
};

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    console.log('Migration successfully finished! 🎉');
    process.exit(0);
  });
