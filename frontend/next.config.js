const withImages = require('next-images');

module.exports = withImages({
  webpack(config) {
    return config;
  },
  env: {
    siteTitle: 'Livraria e Papelaria Espaço',
    siteUrl: 'https://lpespaco.pt',
    apiUrl: process.env.API_URL || 'http://localhost:3337',
    appbar: {
      desktopHeight: 96,
      mobileHeight: 76,
      drawerWidthMobile: 300,
      drawerWidthDesktop: '40vw',
    },
    filters: {
      priceRange: [0, 140],
    },
    footer: {
      gmapsLink: 'https://g.page/livrariaepapelaria-espaco?share',
      address1: 'Av. Combatentes da Grande Guerra 51B',
      address2: '1495-039 Algés',
      phone: '214114076',
      phone2: '961312644',
      email: 'livraria@lpespaco.pt',
      schedule: 'Seg a Sex: 9:30-13:30 / 15:00-19:00\nSáb: 9:30-13:00',
      facebook: 'https://facebook.com/livrariaepapelaria.espaco/',
      instagram: 'https://instagram.com/livraria_espaco/',
      facebookEvents: 'https://www.facebook.com/pg/livrariaepapelaria.espaco/events/',
    },
    googleAnalyticsId: process.env.GA_ID || '',
    tawkToId: process.env.TAWKTO_ID || '',
  },
});
