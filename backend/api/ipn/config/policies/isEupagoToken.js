module.exports = async (ctx, next) => {
  if (
    ctx.request.query &&
    ctx.request.query.chave_api === strapi.config.currentEnvironment.euPagoToken
  ) {
    // Go to next policy or will reach the controller's action.
    return await next();
  }

  ctx.unauthorized(`Invalid token`);
};
