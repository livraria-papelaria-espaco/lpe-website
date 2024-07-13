import React from 'react';
import { shallow } from 'enzyme';
import { Typography } from '@material-ui/core';
import HighlightRow from '../HighlightRow';
import ContentRow from '../ContentRow';

const mockContent = [
  {
    __component: 'highlight.product-list',
    id: 'mock-content-0',
  },
  {
    __component: 'highlight.product-list',
    id: 'mock-content-1',
  },
  {
    __component: 'highlight.product-list',
    id: 'mock-content-2',
  },
];

describe('HighlightRow (components/productsHighlight/HighlightRow)', () => {
  it('Renders title and subtitle correctly', () => {
    const rowData = {
      id: 'someRandomId',
      title: 'This is a title',
      subtitle: 'This is a subtitle',
      content: [],
    };

    const wrapper = shallow(<HighlightRow row={rowData} />);

    expect(wrapper.find(Typography).first().text()).toMatch(rowData.title);
    expect(wrapper.find(Typography).at(1).text()).toMatch(rowData.subtitle);
  });

  it('Renders without crashing when no subtitle is provided', () => {
    const rowData = {
      id: 'someRandomId',
      title: 'This is a title',
      content: [],
    };

    const wrapper = shallow(<HighlightRow row={rowData} />);

    expect(wrapper.find(Typography).first().text()).toMatch(rowData.title);
    expect(wrapper.find(Typography).at(1).text()).toBe('');
  });

  it('Renders a count of content rows', () => {
    const rowData = {
      id: 'someRandomId',
      title: 'Lorem ipsum',
      subtitle: 'dolor sit amet',
      content: mockContent,
    };

    const wrapper = shallow(<HighlightRow row={rowData} />);

    expect(wrapper.find(Typography).first().text()).toMatch(rowData.title);
    expect(wrapper.find(Typography).at(1).text()).toMatch(rowData.subtitle);
    expect(wrapper.find(ContentRow)).toHaveLength(mockContent.length);
  });

  it('Renders a count of content row', () => {
    const rowData = {
      id: 'someRandomId',
      title: 'Lorem ipsum',
      subtitle: 'dolor sit amet',
      content: mockContent,
    };

    const wrapper = shallow(<HighlightRow row={rowData} />);

    expect(wrapper.find(Typography).first().text()).toMatch(rowData.title);
    expect(wrapper.find(Typography).at(1).text()).toMatch(rowData.subtitle);
    expect(wrapper.find(ContentRow)).toHaveLength(mockContent.length);
  });
});
