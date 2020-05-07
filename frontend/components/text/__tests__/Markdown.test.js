import React from 'react';
import { mount } from 'enzyme';
import Markdown from '../Markdown';

describe('Markdown renderer (/components/text/Markdown)', () => {
  it('Renders some markdown correctly when no custom className is provided', () => {
    const text = `
# This is a heading 1
## This is a heading 2

Some text  
and a line break

[This is a link](https://google.com)

![And an image](https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)

Also renders **bold** and _italic_ correctly.
`;

    const wrapper = mount(<Markdown>{text}</Markdown>);

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('Renders some markdown correctly when a custom className is provided', () => {
    const text = `Just a paragraph`;

    const wrapper = mount(<Markdown className='someClassName'>{text}</Markdown>);

    expect(wrapper.html()).toMatchSnapshot();
  });
});
