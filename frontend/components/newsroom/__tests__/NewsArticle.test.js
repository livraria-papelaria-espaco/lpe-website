import React from 'react';
import { shallow } from 'enzyme';
import NewsArticle from '../NewsArticle';

describe('NewsArticle (components/newsroom/NewsArticle', () => {
  it('Renders correctly and matches snapshot', () => {
    const title = 'Lorem Ipsum';
    const content = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit.  
Donec non eros dignissim, dignissim erat eget, tincidunt magna.
Ut nisl risus, *posuere* non **finibus quis, consequat vitae** lacus.`;
    const date = new Date('2019-02-19T15:25:00.000Z').toISOString();

    const wrapper = shallow(<NewsArticle title={title} content={content} date={date} />);
    expect(wrapper).toMatchSnapshot();
  });
});
