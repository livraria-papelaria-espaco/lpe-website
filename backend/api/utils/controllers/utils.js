'use strict';

module.exports = {
  preview: async (ctx) => {
    ctx.send({
      url: `${strapi.config.currentEnvironment.frontendUrl}/api/preview?secret=${encodeURIComponent(
        strapi.config.currentEnvironment.previewSecret
      )}`,
    });
  },
};
