const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(handle).listen(3000, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log('> Ready on http://localhost:3000');
  });
});
