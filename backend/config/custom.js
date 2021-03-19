module.exports = ({ env }) => ({
  lowStockThreshold: 1,
  euPagoToken: env('EUPAGO_TOKEN', 'demo-f9ee-b006-8de5-8e8'),
  euPagoSandbox: env('EUPAGO_TOKEN', 'demo-').startsWith('demo-'),
  frontendUrl: env('FRONTEND_URL', 'http://localhost:3000'),
  previewSecret: env('PREVIEW_SECRET', ''),
  meiliHost: env('MEILI_HOST', 'http://127.0.0.1:7700'),
  meiliApiKey: env('MEILI_API_KEY', ''),
});
