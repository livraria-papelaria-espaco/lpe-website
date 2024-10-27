'use strict';
const axios = require('axios');

/**
 * metadata-fetcher.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const NEWLINE_REGEX = /\n/g;

const fetchImagesFromFnac = async (isbn) => {
  try {
    const response = await axios.get(`https://book-api.diogotc.com/cover/${isbn}`, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(response.data, 'binary');
    return [buffer];
  } catch (e) {
    return [];
  }
};

module.exports = {
  fetchMetadataFromWook: async (isbn) => {
    try {
      const { data } = await axios.get(`https://book-api.diogotc.com/wook/info-by-isbn/${isbn}`);
      return {
        name: data.name,
        type: 'Livro',
        bookAuthor: (data.author || {}).name,
        bookEdition: data.bookEdition,
        bookPublisher: (data.publisher || {}).name,
        bookPages: data.numberOfPages,
        publishedDate: data.datePublished,
        language: data.inLanguage,
        description: data.description
          ? `# Sinopse\n${data.description.replace(NEWLINE_REGEX, '  \n')}`
          : undefined,
        shortDescription: data.alternativeHeadline,
        ...(data.isSchoolbook ? { show: false } : {})
      };
    } catch (e) {
      return null;
    }
  },

  fetchImagesFromFnac,

  isISBN: (isbn) => {
    if (!isbn || isbn.length !== 13 || !isbn.startsWith('978')) return false;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      let digit = parseInt(isbn[i]);
      if (i % 2 == 1) sum += 3 * digit;
      else sum += digit;
    }
    const check = (10 - (sum % 10)) % 10;
    return check == isbn[isbn.length - 1];
  },

  fetchAndUploadImages: async (isbn, slug) => {
    const images = await fetchImagesFromFnac(isbn);

    const uploadService = strapi.plugins['upload'].services.upload;
    const { optimize } = strapi.plugins['upload'].services['image-manipulation'];

    return Promise.all(
      images.map(async (readBuffer, i) => {
        const { buffer, info } = await optimize(readBuffer);

        const formattedFile = uploadService.formatFileInfo(
          {
            filename: `${slug}-${i}.jpg`,
            type: 'image/jpeg',
            size: (buffer.length / 1000).toFixed(2),
          },
          { alternativeText: '', caption: '', name: null },
          {}
        );

        return uploadService.uploadFileAndPersist({ ...formattedFile, ...info, buffer });
      })
    );
  },
};