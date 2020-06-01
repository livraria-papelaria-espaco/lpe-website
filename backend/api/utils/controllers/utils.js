'use strict';

module.exports = {
  preview: async (ctx) => {
    ctx.send({
      url: `${strapi.config.get(
        'custom.frontendUrl',
        'http://localhost:3000'
      )}/api/preview?secret=${encodeURIComponent(strapi.config.get('custom.previewSecret', ''))}`,
    });
  },
};
