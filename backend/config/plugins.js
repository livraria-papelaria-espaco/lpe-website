module.exports = ({ env }) => ({
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: env('SMTP_HOST', 'localhost'),
      port: env.int('SMTP_PORT', 25),
      auth: {
        user: env('SMTP_USERNAME', ''),
        pass: env('SMTP_PASSWORD', ''),
      },
    },
    settings: {
      defaultFrom: '"[DEV] Livraria e Papelaria Espaço" <dev@lpespaco.pt>',
      defaultReplyTo: '"Livraria e Papelaria Espaço" <livraria@lpespaco.pt>',
    },
  },
});
