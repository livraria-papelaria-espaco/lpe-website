module.exports = {
  email: {
    provider: 'lpemailer',
    providerOptions: {
      logger: false,
    },
    settings: {
      defaultFrom: '"Livraria e Papelaria Espaço" <no-reply@lpespaco.pt>',
      defaultReplyTo: '"Livraria e Papelaria Espaço" <geral@lpespaco.pt>',
    },
  },
};
