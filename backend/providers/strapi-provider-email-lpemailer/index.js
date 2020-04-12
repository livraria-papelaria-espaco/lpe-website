'use strict';

const nodemailer = require('nodemailer');

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function getTransporterConfig(config) {
  const secure = config.secure === 'true';
  let transporterConfig = {
    host: config.host,
    port: Number.parseInt(config.port),
    secure,
    secureConnection: secure,
    pool: config.pool === 'true' ? true : false,
    debug: false,
    logger: true,
    maxConnections: config.maxConnections ? Number.parseInt(config.maxConnections) : 10,
    maxMessages: config.maxConnections ? Number.parseInt(config.maxMessages) : 100,
    rateDelta: config.maxConnections ? Number.parseInt(config.rateDelta) : 1000,
    ignoreTLS: config.ignoreTLS === 'true' ? true : false,
    auth: {
      user: config.username,
      pass: config.password,
    },
  };

  if (config.allowSelfSigned === 'true') {
    transporterConfig.tls = {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
    };
  }

  return transporterConfig;
}

module.exports = {
  provider: 'LPE Mailer',
  name: 'LPEMailer',
  auth: {
    nodemailer_default_from: {
      label: 'From',
      type: 'text',
    },
    nodemailer_default_replyto: {
      label: 'Reply To',
      type: 'text',
    },
    host: {
      label: 'Host',
      type: 'text',
    },
    port: {
      label: 'Port',
      type: 'text',
    },
    username: {
      label: 'Username',
      type: 'text',
    },
    password: {
      label: 'Password',
      type: 'password',
    },
    attempts: {
      label: 'Number of re-sending attempts after sending failure',
      type: 'text',
    },
    sleep: {
      label: 'Sleep time after each attempt (milliseconds)',
      type: 'text',
    },
    maxConnections: {
      label: 'Max Connections (default 10)',
      type: 'text',
    },
    maxMessages: {
      label: 'Max messages default (100)',
      type: 'text',
    },
    rateDelta: {
      label: 'Rate delta (milliseconds, default 1000)',
      type: 'text',
    },
    pool: {
      label: 'Pool connection (write true or false)',
      type: 'text',
    },
    secure: {
      label: 'Use (TSL) secure connection (write true or false)',
      type: 'text',
    },
    allowSelfSigned: {
      label: 'Allow self certificates (write true or false)',
      type: 'text',
    },
    ignoreTLS: {
      label: 'Ignore the use of TLS (write true or false)',
      type: 'text',
    },
  },
  init: (config) => {
    const sleepTime = config.sleep ? Number.parseInt(config.sleep) : 1000;
    const transporterConfig = getTransporterConfig(config);
    const transporter = nodemailer.createTransport(transporterConfig);
    let attempts =
      config.attempts && Number.parseInt(config.attempts) > 0
        ? Number.parseInt(config.attempts)
        : 1;

    return {
      send: (options) => {
        return new Promise(async (resolve, reject) => {
          options = options instanceof Object ? options : {};

          let message = {
            from: options.from || config.nodemailer_default_from,
            to: options.to || config.nodemailer_default_replyto,
            replyTo: options.replyTo || config.nodemailer_default_replyto,
            subject: options.subject,
            text: options.text || '',
            html: options.html || options.text,
          };

          if (options.attachments) {
            message.attachments = options.attachments;
          }

          while (attempts > 0) {
            try {
              const info = await transporter.sendMail(message);
              return resolve(info);
            } catch (e) {
              if (attempts === 0) {
                return reject(e);
              }
            }

            attempts -= 1;
            console.log(
              `The email to ${message.to} has failed to send for some reason, we are tryng to resend the email`
            );
            console.log(`Current configurations:`, transporterConfig);
            console.log(`Remainig attempts ${attempts} timestamp:`);
            await sleep(sleepTime);
          }

          return reject({
            message: `Unable to send the email to ${message.to}`,
          });
        });
      },
    };
  },
};
