const strapi = require('strapi');
const app = strapi();
app.start(() => {
  if (typeof process.send === 'function') process.send('ready');
});

process.on('SIGINT', () => {
  if (app.server) {
    app.server.close(() => {
      process.exit(0);
    });
  }
});
