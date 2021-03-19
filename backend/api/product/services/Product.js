'use strict';

const convertSortQueryParams = (sortQuery) => {
  if (typeof sortQuery !== 'string') {
    throw new Error(`convertSortQueryParams expected a string, got ${typeof sortQuery}`);
  }

  const sortKeys = {};

  sortQuery.split(',').forEach((part) => {
    // split field and order param with default order to ascending
    const [field, order = 'asc'] = part.split(':');

    if (field.length === 0) {
      throw new Error('Field cannot be empty');
    }

    if (!['asc', 'desc'].includes(order.toLocaleLowerCase())) {
      throw new Error('order can only be one of asc|desc|ASC|DESC');
    }

    // eslint-disable-next-line security/detect-object-injection
    sortKeys[field] = order.toLowerCase() === 'asc' ? 1 : -1;
  });
  return sortKeys;
};

const convertStartQueryParams = (startQuery) => {
  const startAsANumber = parseInt(startQuery);
  if (isNaN(startAsANumber) || startAsANumber < 0) {
    throw new Error(`convertStartQueryParams expected a positive integer got ${startAsANumber}`);
  }
  return startAsANumber;
};

const convertLimitQueryParams = (limitQuery) => {
  const limitAsANumber = parseInt(limitQuery);
  if (isNaN(limitAsANumber) || (limitAsANumber !== -1 && limitAsANumber < 0)) {
    throw new Error(`convertLimitQueryParams expected a positive integer got ${limitAsANumber}`);
  }
  return limitAsANumber;
};

module.exports = {
  searchEnhanced: async (params) => {
    let searchQuery;
    const filterQuery = {
      show: true,
    };

    if (params.query)
      searchQuery = [
        { name: { $regex: params.query, $options: 'i' } },
        { shortDescription: { $regex: params.query, $options: 'i' } },
        { reference: { $regex: params.query, $options: 'i' } },
        { bookAuthor: { $regex: params.query, $options: 'i' } },
        { bookPublisher: { $regex: params.query, $options: 'i' } },
      ];

    if (params.minPrice !== undefined && params.maxPrice !== undefined)
      filterQuery.price = { $gte: params.minPrice, $lte: params.maxPrice };

    if (params.category) {
      const categories = await strapi
        .query('category')
        .model.find({ path: { $regex: `,${params.category},` } })
        .select('_id')
        .then((result) => result.map((v) => (v ? v.toObject()._id : null)));
      filterQuery.category = { $in: categories };
    }

    const queryObject = {};

    if (!!searchQuery || Object.keys(filterQuery).length !== 0) {
      queryObject.$and = [];
      if (searchQuery) queryObject.$and.push({ $or: searchQuery });
      if (Object.keys(filterQuery).length !== 0) queryObject.$and.push(filterQuery);
    }

    const query = strapi.query('product').model.find(queryObject);

    if (params.sort) query.sort(convertSortQueryParams(params.sort));
    if (params.start) query.skip(convertStartQueryParams(params.start));
    if (params.limit) {
      const limit = convertLimitQueryParams(params.limit);
      if (limit >= 0) query.limit(limit);
    }

    return query
      .exec()
      .then((results) => results.map((result) => (result ? result.toObject() : null)));
  },

  decreaseStock: async ({ id, qnt }) => {
    if (!id || !qnt) return;

    const res = await strapi
      .query('product')
      .model.updateOne({ _id: id, quantity: { $gte: qnt } }, { $inc: { quantity: -qnt } });

    if (res.nModified !== 1) throw new Error(`Couldn't decrease stock for ${id}.`);
  },

  updateStock: async ({ ref, qnt, price: cost }) => {
    try {
      const { _id, quantity /*, lastQuantity*/, price } = await strapi
        .query('product')
        .model.findOne({ reference: ref }, ['_id', 'quantity', 'lastQuantity', 'price']);

      // I don't think the client actually updates the stock, so I'm going to stop using that value

      // const stockDelta = quantity - lastQuantity + (qnt - lastQuantity);
      // let newStock = lastQuantity + stockDelta;
      let newStock = qnt === undefined ? quantity : qnt;
      if (newStock < 0) newStock = 0;

      const newPrice = cost === undefined ? price : cost;

      const res = await strapi
        .query('product')
        .model.updateOne({ _id }, { quantity: newStock, lastQuantity: newStock, price: newPrice });

      if (res.nModified !== 1) {
        strapi.log.error(
          `Couldn't update stock/price for ${ref} to quantity ${qnt} or price ${cost}.`
        );
        return { ref, qnt, price: cost };
      }

      return { ref, qnt: newStock, price: newPrice };
    } catch {
      // Most likely product not found
      return { ref, qnt };
    }
  },
};
