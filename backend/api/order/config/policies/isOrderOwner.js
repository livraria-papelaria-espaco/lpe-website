module.exports = async (ctx, next) => {
  const order = await strapi.models.order.findOne({ _id: ctx.query.id });
  if (!!order && order.user == ctx.state.user.id) return await next();
  return ctx.unauthorized("You can't access this order");
};
