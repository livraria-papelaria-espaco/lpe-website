module.exports = {
  publicRuntimeConfig: {
    siteTitle: 'Livraria e Papelaria Espaço',
    apiUrl: process.env.API_URL || 'http://localhost:3337',
    appbar: {
      desktopHeight: 96,
      mobileHeight: 76,
      drawerWidth: 300,
    },
    filters: {
      priceRange: [0, 100],
    },
    footer: {
      gmapsLink: 'https://g.page/livrariaepapelaria-espaco?share',
      address1: 'Av. Combatentes da Grande Guerra 51',
      address2: '1495-039 Algés',
      phone: '214114076',
      email: 'geral@lpespaco.pt',
    },
  },
};
