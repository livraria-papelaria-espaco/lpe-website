const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const SITEMAP_REGEX = /\/sitemap-(main|categories|\d+)\.xml/;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    const sitemapResult = SITEMAP_REGEX.exec(pathname);
    if (sitemapResult) {
      app.render(req, res, '/sitemap.xml', { ...query, page: sitemapResult[1] });
    } else {
      handle(req, res, parsedUrl);
    }
  });

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
