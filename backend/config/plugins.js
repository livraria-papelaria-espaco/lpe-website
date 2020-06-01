module.exports = ({ env }) => ({
  email: {
    provider: 'lpemailer',
    providerOptions: {
      host: env('SMTP_HOST', 'localhost'),
      port: env.int('SMTP_PORT', 25),
      secure: false,
      secureConnection: false,
      pool: false,
      debug: false,
      logger: true,
      maxConnections: 10,
      maxMessages: 100,
      rateDelta: 1000,
      ignoreTLS: true,
      auth: {
        user: env('SMTP_USERNAME', ''),
        pass: env('SMTP_PASSWORD', ''),
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
    settings: {
      defaultFrom: '"[DEV] Livraria e Papelaria Espaço" <dev@lpespaco.pt>',
      defaultReplyTo: '"Livraria e Papelaria Espaço" <livraria@lpespaco.pt>',
    },
  },
});
