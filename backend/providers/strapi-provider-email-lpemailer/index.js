'use strict';

const nodemailer = require('nodemailer');

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

module.exports = {
  init: (providerOptions = {}, settings = {}) => {
    const transporter = nodemailer.createTransport({ ...providerOptions });

    const sleepTime = 5000;
    let attempts = 2;

    return {
      send: async (options) => {
        options = options instanceof Object ? options : {};

        let message = {
          from: options.from || settings.defaultFrom,
          to: options.to || settings.defaultReplyTo,
          replyTo: options.replyTo || settings.defaultReplyTo,
          subject: options.subject,
          text: options.text || '',
          html: options.html || options.text,
        };

        if (options.attachments) {
          message.attachments = options.attachments;
        }

        while (attempts > 0) {
          let error;
          try {
            const info = await transporter.sendMail(message);
            return info;
          } catch (e) {
            if (attempts === 0) {
              throw e;
            }
            error = e;
          }

          attempts -= 1;
          strapi.logger.error(
            {
              message,
              remainingAttemps: attempts,
              error,
            },
            'Failed to send email'
          );
          await sleep(sleepTime);
        }

        throw new Error({
          message: `Unable to send the email to ${message.to}`,
        });
      },
    };
  },
};
