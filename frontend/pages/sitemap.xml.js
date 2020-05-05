import React from 'react';
import gql from 'graphql-tag';
import { fetchAPI, fetchREST } from '~/lib/graphql';

const CATEGORIES_QUERY = gql`
  query GET_ALL_CATEGORIES {
    categories {
      slug
    }
  }
`;

const PRODUCTS_QUERY = gql`
  query GET_ALL_PRODUCTS($offset: Int!) {
    productsSearch(limit: 100, start: $offset, sort: "createdAt:asc") {
      slug
      updatedAt
    }
  }
`;

const SiteMap = () => {
  return <div />;
};

const LIMIT = 3000;

const siteMap = [
  {
    loc: '/',
    priority: 1.0,
    changefreq: 'hourly',
  },
  {
    loc: '/search/',
    priority: 0.9,
    changefreq: 'hourly',
  },
  {
    loc: '/newsroom/',
    priority: 0.9,
    changefreq: 'daily',
  },
  {
    loc: '/legal/privacy/',
    priority: 0.1,
    changefreq: 'monthly',
  },
  {
    loc: '/legal/tos/',
    priority: 0.1,
    changefreq: 'monthly',
  },
  {
    loc: '/auth/signin/',
    priority: 0.3,
    changefreq: 'monthly',
  },
  {
    loc: '/auth/signup/',
    priority: 0.3,
    changefreq: 'monthly',
  },
];

const generateUrlSet = (links) => `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${links
      .map(
        (link) => `
      <url>
        ${Object.keys(link)
          .map((key) => `<${key}>${key === 'loc' ? process.env.siteUrl : ''}${link[key]}</${key}>`)
          .join('\n')}
      </url>`
      )
      .join('\n')}
</urlset>`;

const generateSitemapIndex = (links) => `
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${links
      .map(
        (link) => `
      <sitemap>
        <loc>${process.env.siteUrl}${link}</loc>
      </sitemap>`
      )
      .join('\n')}
</sitemapindex>`;

const generateXML = async (type) => {
  if (type === 'main') return generateUrlSet(siteMap);
  if (type === 'categories') {
    const data = await fetchAPI(CATEGORIES_QUERY);
    return generateUrlSet(
      data.categories.map((category) => ({
        loc: `/category/${category.slug}/`,
        priority: 0.5,
        changefreq: 'hourly',
      }))
    );
  }

  const productCount = await fetchREST(`/products/count`, { query: { show: true } });

  if (type === 'list') {
    return generateSitemapIndex([
      '/sitemap-main.xml',
      '/sitemap-categories.xml',
      ...[...new Array(Math.ceil(productCount / LIMIT))].map((_, i) => `/sitemap-${i}.xml`),
    ]);
  }

  const pageNumber = Number.parseInt(type, 10);
  if (Number.isNaN(pageNumber)) return '';

  let offset = pageNumber * LIMIT;
  const products = [];
  while (offset < productCount && offset < (pageNumber + 1) * LIMIT) {
    // eslint-disable-next-line no-await-in-loop
    const data = await fetchAPI(PRODUCTS_QUERY, { variables: { offset } });
    products.push(
      ...data.productsSearch.map((product) => ({
        loc: `/product/${product.slug}/`,
        lastmod: product.updatedAt,
        changefreq: `daily`,
        priority: 0.6,
      }))
    );

    offset += 100;
  }

  return generateUrlSet(products);
};

export async function getServerSideProps({ params, req, res, query }) {
  const xml = await generateXML(query.page || 'list');
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public,max-age=600');
  res.write(`<?xml version="1.0" encoding="UTF-8"?>
  ${xml}`);
  res.end();

  return { props: {} };
}

export default SiteMap;
