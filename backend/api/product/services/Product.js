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

    sortKeys[field] = order.toLowerCase();
  });
  console.log(sortKeys);
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
    console.log(params);
    let searchQuery;
    const filterQuery = {};

    if (params.query)
      searchQuery = [
        { name: { $regex: params.query, $options: 'i' } },
        { shortDescription: { $regex: params.query, $options: 'i' } },
        { reference: { $regex: params.query, $options: 'i' } },
        { 'bookInfo.publisher': { $regex: params.query, $options: 'i' } },
      ];

    if (params.minPrice !== undefined && params.maxPrice !== undefined)
      filterQuery.price = { $gte: params.minPrice, $lte: params.maxPrice };

    if (params.category) filterQuery.category = params.category;

    const queryObject = {};

    if (!!searchQuery || Object.keys(filterQuery).length !== 0) {
      queryObject.$and = [];
      if (!!searchQuery) queryObject.$and.push({ $or: searchQuery });
      if (Object.keys(filterQuery).length !== 0) queryObject.$and.push(filterQuery);
    }

    console.log(queryObject);

    const query = strapi.query('product').model.find(queryObject);

    if (params.sort) query.sort(convertSortQueryParams(params.sort));
    if (params.start) query.skip(convertStartQueryParams(params.start));
    if (params.limit) query.limit(convertLimitQueryParams(params.limit));

    return query.then((results) => results.map((result) => (result ? result.toObject() : null)));
  },
};
