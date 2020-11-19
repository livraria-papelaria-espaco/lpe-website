'use strict';
const axios = require('axios');
//const sharp = require('sharp');

/**
 * metadata-fetcher.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const WOOK_REGEX = /<script type="application\/ld\+json">[^]*?({[^]+})[^]*?<\/script>[^]*?<!-- Fim Google/;
const NEWLINE_REGEX = /\n/g;
/*const FNAC_SEARCH_REGEX = /<a href="(.+?)" class=".*?Article-title js-minifa-title js-Search-hashLink.*?">.+?<\/a>/;
const FNAC_REGEX = /<script type="application\/json" class="js-configuration">[^]*?({.+})[^]*?<\/script>/;
const FNAC_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};*/

/*const fetchFnacImage = async (url, i) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const trimmedBuffer = await sharp(buffer).trim().jpeg().toBuffer();
    return trimmedBuffer;
  } catch (e) {
    return undefined;
  }
};*/

const fetchImagesFromFnac = async (isbn) => {
  try {
    const response = await axios.get(`https://book-api.diogotc.com/cover/${isbn}`, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(response.data, 'binary');
    return [buffer];
    /*const searchResponse = await axios.get(
      `https://www.fnac.pt/SearchResult/ResultList.aspx?Search=${isbn}`,
      {
        headers: FNAC_HEADERS,
      }
    );
    const productUrl = (FNAC_SEARCH_REGEX.exec(searchResponse.data) || [])[1];

    const response = await axios.get(productUrl, {
      headers: FNAC_HEADERS,
    });
    const dataString = (FNAC_REGEX.exec(response.data) || [])[1];
    const data = JSON.parse(dataString);
    console.log(data);
    const images = await Promise.all(
      data.productData.images.map((imgSet, i) =>
        fetchFnacImage(imgSet.zoom || imgSet.image || imgSet.thumb)
      )
    );
    return images.filter((i) => !!i);*/
  } catch (e) {
    return [];
  }
};

module.exports = {
  fetchMetadataFromWook: async (isbn) => {
    try {
      const response = await axios.get(`https://www.wook.pt/pesquisa/${isbn}`);
      const dataString = (WOOK_REGEX.exec(response.data) || [])[1];
      const data = JSON.parse(dataString);
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
    console.log('images', images);

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
