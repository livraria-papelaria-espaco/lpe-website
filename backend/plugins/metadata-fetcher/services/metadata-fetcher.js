'use strict';
const axios = require('axios');
const sharp = require('sharp');

/**
 * metadata-fetcher.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const WOOK_REGEX = /<script type="application\/ld\+json">[^]*?({[^]+})[^]*?<\/script>[^]*?<!-- Fim Google/;
const NEWLINE_REGEX = /\n/g;
const FNAC_SEARCH_REGEX = /<a href="(.+?)" class=".*?Article-title js-minifa-title js-Search-hashLink.*?">.+?<\/a>/;
const FNAC_REGEX = /<script type="application\/json" class="js-configuration">[^]*?({.+})[^]*?<\/script>/;

const fetchFnacImage = async (url, i) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const trimmedBuffer = await sharp(buffer).trim().jpeg().toBuffer();
    return trimmedBuffer;
  } catch (e) {
    return undefined;
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

  fetchImagesFromFnac: async (isbn) => {
    try {
      const searchResponse = await axios.get(
        `https://www.fnac.pt/SearchResult/ResultList.aspx?Search=${isbn}`
      );
      const productUrl = (FNAC_SEARCH_REGEX.exec(searchResponse.data) || [])[1];

      const response = await axios.get(productUrl);
      const dataString = (FNAC_REGEX.exec(response.data) || [])[1];
      const data = JSON.parse(dataString);
      const images = await Promise.all(
        data.productData.images.map((imgSet, i) =>
          fetchFnacImage(imgSet.zoom || imgSet.image || imgSet.thumb)
        )
      );
      return images.filter((i) => !!i);
    } catch (e) {
      return [];
    }
  },
};
