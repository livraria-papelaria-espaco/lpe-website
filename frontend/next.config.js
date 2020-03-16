const path = require('path');
const webpack = require('webpack');

module.exports = {
  publicRuntimeConfig: {
    siteTitle: 'Livraria e Papelaria Espaço',
    apiUrl: process.env.API_URL || 'http://localhost:3337',
  },
  webpack: (config) => {
    config.resolve.alias['~'] = path.resolve(__dirname);
    return config;
  },
};
