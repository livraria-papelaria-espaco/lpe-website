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
  searchEnhanced: (params) => {
    let searchQuery;
    const aggregate = [];

    if (params.minPrice !== undefined && params.maxPrice !== undefined)
      aggregate.push({
        $match: { price: { $gte: params.minPrice, $lte: params.maxPrice }, show: true },
      });

    if (params.category) {
      aggregate.push({
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      });
      aggregate.push({
        $match: {
          'category.path': { $regex: `,${params.category},` },
        },
      });
    }

    aggregate.push({
      $lookup: {
        from: 'components_meta_book_infos',
        localField: 'bookInfo.ref',
        foreignField: '_id',
        as: 'bookInfo',
      },
    });

    if (params.query) {
      aggregate.push({
        $match: {
          $or: [
            { name: { $regex: params.query, $options: 'i' } },
            { shortDescription: { $regex: params.query, $options: 'i' } },
            { reference: { $regex: params.query, $options: 'i' } },
            { 'bookInfo.author': { $regex: params.query, $options: 'i' } },
            { 'bookInfo.publisher': { $regex: params.query, $options: 'i' } },
          ],
        },
      });
    }

    aggregate.push({
      $unwind: {
        path: '$bookInfo',
        preserveNullAndEmptyArrays: true,
      },
    });

    if (params.sort) aggregate.push({ $sort: convertSortQueryParams(params.sort) });

    if (params.start) aggregate.push({ $skip: convertStartQueryParams(params.start) });

    const limit = params.limit !== undefined ? convertLimitQueryParams(params.limit) : -1;
    aggregate.push({ $limit: limit < 0 ? 100 : limit });

    return strapi.query('product').model.aggregate(aggregate);
  },

  decreaseStock: async ({ id, qnt }) => {
    if (!id || !qnt) return;

    const res = await strapi
      .query('product')
      .model.updateOne({ _id: id, quantity: { $gte: qnt } }, { $inc: { quantity: -qnt } });

    if (res.nModified !== 1) throw new Error(`Couldn't decrease stock for ${id}.`);
  },
};
