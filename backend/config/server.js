module.exports = ({ env }) => ({
  host: env.int('HOST', '0.0.0.0'),
  port: env.int('PORT', 3337),
  cron: {
    enabled: true,
  },
  admin: {
    autoOpen: false,
  },
});
