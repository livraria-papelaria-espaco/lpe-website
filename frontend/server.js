const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(handle);

  process.on('SIGINT', () => {
    server.close(() => {
      process.exit(0);
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log('> Ready on http://localhost:3000');
    if (typeof process.send === 'function') process.send('ready');
  });
});
