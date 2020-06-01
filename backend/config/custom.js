module.exports = ({ env }) => ({
  lowStockThreshold: 1,
  euPagoToken: env('EUPAGO_TOKEN', 'demo-f9ee-b006-8de5-8e8'),
  euPagoSandbox: env('EUPAGO_TOKEN', 'demo-').startsWith('demo-'),
  frontendUrl: env('FRONTEND_URL', 'http://localhost:3000'),
  previewSecret: env('PREVIEW_SECRET', ''),
});
