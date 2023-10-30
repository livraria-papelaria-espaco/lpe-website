const path = require('path');

const createStrapiApp = async (projectPath) => {
  if (!projectPath) {
    throw new Error(`
-> Path to strapi project is missing.
-> Usage: node refreshBookMetadata.js [path]`);
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
-> Strapi lib couldn't be found. Are the node_modules installed?
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

const run = async () => {
  const projectPath = process.argv[2];
  const app = await createStrapiApp(projectPath);

  let metadataServices = strapi.plugins['metadata-fetcher'].services['metadata-fetcher'];

  const category = await strapi.services.category.findOne({ name: 'Livraria' });
  if (!category) {
    throw "Category 'Livraria' does not exist!";
  }

  const count = await app.services.product.count({ _sort: 'createdAt:DESC' });
  console.log(`Found ${count} products`);
  let i = 0;
  while (i < count) {
    const products = await app.services.product.find({ _start: i, _sort: 'createdAt:DESC' });
    for (let product of products) {
      ++i;
      if (metadataServices.isISBN(product.reference) && !product.show && product.type === 'Outro') {
        console.log(`Handling product ${product.reference} (${i}/${count})`);

        const isbn = product.reference;
        const metadata = await metadataServices.fetchMetadataFromWook(isbn);
        if (!metadata) {
          console.log('No metadata found on external services');
          continue;
        }

        product = {
          ...product,
          show: (product.price || 0) > 0,
          ...metadata,
          category: category.id,
        };

        const contentManagerService = strapi.plugins['content-manager'].services['entity-manager'];

        try {
          if (!product.images || product.images.length === 0) {
            product = {
              ...product,
              images: await metadataServices.fetchAndUploadImages(isbn, product.slug),
            };
          }
          await contentManagerService.update(
            { id: product.id },
            product,
            'application::product.product'
          );
        } catch (e) {
          console.error('Failed handling product', e);
        }
      }
    }
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
