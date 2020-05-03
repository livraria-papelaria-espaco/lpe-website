import React from 'react';
import Head from 'next/head';

import PropTypes from 'prop-types';

const formatProductDescription = (description) => {
  if (!description || typeof description !== 'string') return '';

  if (description.startsWith('# Sinopse')) return description.replace('# Sinopse', '');
  return description;
};

const ProductSEO = ({ product }) => {
  const description = formatProductDescription(product.description);

  const image = product.images && product.images[0] && product.images[0].url;

  let structedData;

  if (product.type === 'Livro') {
    structedData = {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: product.name,
      author: {
        '@type': 'Person',
        name: product.bookAuthor,
      },
      url: `${process.env.siteUrl}/product/${product.slug}`,
      datePublished: product.publishedDate,
      bookEdition: product.bookEdition,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'EUR',
        seller: {
          '@type': 'Organization',
          name: process.env.siteTitle,
        },
      },
      isbn: product.reference,
      inLanguage: product.language,
      numberOfPages: product.bookPages,
      publisher: {
        '@type': 'Organization',
        name: product.bookPublisher,
      },
      headline: product.name,
      alternativeHeadline: product.shortDescription,
      image: `${process.env.apiUrl}${image}`,
    };
  } else {
    structedData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      url: `${process.env.siteUrl}/product/${product.slug}`,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'EUR',
        seller: {
          '@type': 'Organization',
          name: process.env.siteTitle,
        },
      },
      inLanguage: product.language,
      image: `${process.env.apiUrl}${image}`,
      sku: product.reference,
    };
  }

  return (
    <Head>
      <meta name='description' property='og:description' content={description} />
      <meta name='robots' content='index, follow' />
      <meta name='googlebot' content='index, follow' />

      {/* Open Graph */}
      <meta property='og:title' content={`${product.name} | ${process.env.siteTitle}`} />
      <meta property='og:locale' content='pt_PT' />
      {image && <meta property='og:image' content={`${process.env.apiUrl}${image}`} />}

      {product.type === 'Livro' && (
        <>
          <meta property='og:type' content='book' />
          <meta property='og:book:author' content={product.bookAuthor} />
          <meta property='og:book:isbn' content={product.reference} />
          <meta property='og:book:release_date' content={product.publishedDate} />
        </>
      )}

      <script
        type='application/ld+json'
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structedData),
        }}
      />
    </Head>
  );
};

ProductSEO.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    description: PropTypes.string,
    shortDescription: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ),
    price: PropTypes.number.isRequired,
    reference: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    bookAuthor: PropTypes.string,
    bookEdition: PropTypes.string,
    bookPublisher: PropTypes.string,
    bookPages: PropTypes.number,
    publishedDate: PropTypes.string,
    language: PropTypes.string,
  }).isRequired,
};

export default ProductSEO;
