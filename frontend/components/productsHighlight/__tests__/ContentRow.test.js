import React from 'react';
import { shallow } from 'enzyme';
import { Typography, Badge } from '@material-ui/core';
import ContentRow from '../ContentRow';
import ProductList from '~/components/products/ProductList';
import ProductCard from '~/components/products/ProductCard';
import Markdown from '~/components/text/Markdown';

const mockProducts = [
  {
    id: 'mock-product-1',
    slug: 'product-1',
    reference: '123',
    name: 'Product 1',
    price: 9.99,
    type: 'Livro',
  },
  {
    id: 'mock-product-2',
    slug: 'product-2',
    reference: '456',
    name: 'Product 2',
    price: 4.99,
    type: 'Outro',
  },
  {
    id: 'mock-product-3',
    slug: 'product-3',
    reference: '789',
    name: 'Product 3',
    price: 14.99,
    type: 'Livro',
  },
];

describe('ContentRow (/components/productHighlight/ContentRow)', () => {
  describe('When row type is `product-list`', () => {
    it('Renders a product list row type correctly without a title', () => {
      const mockRow = {
        __component: 'highlight.product-list',
        id: 'mock-row-1',
        products: mockProducts,
      };

      const wrapper = shallow(<ContentRow row={mockRow} />);
      expect(wrapper.find(Typography)).toHaveLength(0);
    });

    it('Renders a product list row type correctly with a title', () => {
      const rowTitle = 'Some title';
      const mockRow = {
        __component: 'highlight.product-list',
        id: 'mock-row-2',
        products: mockProducts,
        title: rowTitle,
      };

      const wrapper = shallow(<ContentRow row={mockRow} />);
      const productList = wrapper.find(ProductList);
      expect(productList.prop('products')).toBe(mockProducts);
      expect(wrapper.find(Typography).text()).toMatch(rowTitle);
    });
  });

  describe('When row type is `product-with-description`', () => {
    const description = `# Lorem Ipsum`;

    it('Renders a single product row type correctly without a title nor a badgeNumber', () => {
      const mockRow = {
        __component: 'highlight.product-with-description',
        id: 'mock-row-2',
        product: mockProducts[0],
        description,
      };

      const wrapper = shallow(<ContentRow row={mockRow} />);
      const productCard = wrapper.find(ProductCard);
      expect(productCard.prop('product')).toBe(mockProducts[0]);
      expect(wrapper.find(Markdown).prop('children')).toMatch(description);
      expect(wrapper.find(Typography)).toHaveLength(0);
      expect(wrapper.find(Badge).prop('badgeContent')).toBe(0);
    });

    it('Renders a single product row type correctly with a badgeNumber but without a title', () => {
      const badgeNumber = 3;
      const mockRow = {
        __component: 'highlight.product-with-description',
        id: 'mock-row-3',
        product: mockProducts[0],
        description,
        badgeNumber,
      };

      const wrapper = shallow(<ContentRow row={mockRow} />);
      const productCard = wrapper.find(ProductCard);
      expect(productCard.prop('product')).toBe(mockProducts[0]);
      expect(wrapper.find(Markdown).prop('children')).toMatch(description);
      expect(wrapper.find(Typography)).toHaveLength(0);
      expect(wrapper.find(Badge).prop('badgeContent')).toMatch(`#${badgeNumber}`);
    });

    it('Renders a single product row type type correctly with a title and a badgeNumber', () => {
      const rowTitle = 'Some title';
      const badgeNumber = 7;
      const mockRow = {
        __component: 'highlight.product-with-description',
        id: 'mock-row-4',
        product: mockProducts[0],
        description,
        badgeNumber,
        title: rowTitle,
      };

      const wrapper = shallow(<ContentRow row={mockRow} />);
      const productCard = wrapper.find(ProductCard);
      expect(productCard.prop('product')).toBe(mockProducts[0]);
      expect(wrapper.find(Markdown).prop('children')).toMatch(description);
      expect(wrapper.find(Typography).text()).toMatch(rowTitle);
      expect(wrapper.find(Badge).prop('badgeContent')).toMatch(`#${badgeNumber}`);
    });
  });

  describe('When row type is `top-10`', () => {
    it('Renders a top 10 row type correctly without a title nor startAt', () => {
      const mockRow = {
        __component: 'highlight.top-10',
        id: 'mock-row-5',
        products: mockProducts,
      };

      const wrapper = shallow(<ContentRow row={mockRow} />);
      const productList = wrapper.find(ProductList);
      expect(productList.prop('products')).toBe(mockProducts);
      expect(productList.prop('startAt')).toBe(0);
      expect(wrapper.find(Typography)).toHaveLength(0);
    });

    it('Renders a single product row type correctly with startAt but without a title', () => {
      const startAt = 3;
      const mockRow = {
        __component: 'highlight.top-10',
        id: 'mock-row-6',
        products: mockProducts,
        startAt,
      };

      const wrapper = shallow(<ContentRow row={mockRow} />);
      const productList = wrapper.find(ProductList);
      expect(productList.prop('products')).toBe(mockProducts);
      expect(productList.prop('startAt')).toBe(startAt);
      expect(wrapper.find(Typography)).toHaveLength(0);
    });

    it('Renders a single product row type type correctly with a title and startAt', () => {
      const rowTitle = 'Some title';
      const startAt = 7;
      const mockRow = {
        __component: 'highlight.top-10',
        id: 'mock-row-7',
        products: mockProducts,
        startAt,
        title: rowTitle,
      };

      const wrapper = shallow(<ContentRow row={mockRow} />);
      const productList = wrapper.find(ProductList);
      expect(productList.prop('products')).toBe(mockProducts);
      expect(productList.prop('startAt')).toBe(startAt);
      expect(wrapper.find(Typography).text()).toMatch(rowTitle);
    });
  });

  it('Should render correctly even if row type is invalid', () => {
    const mockRow = {
      __component: 'invalid-type',
      id: 'mock-row-8',
    };

    shallow(<ContentRow row={mockRow} />);
  });
});
