const strapi = require('strapi');
const app = strapi();
app.start(() => process.send('ready'));

process.on('SIGINT', () => {
  if (app.server) {
    app.server.close(() => {
      process.exit(0);
    });
  }
});
