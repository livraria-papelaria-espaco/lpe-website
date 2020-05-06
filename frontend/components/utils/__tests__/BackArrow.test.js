import React from 'react';
import { mount } from 'enzyme';
import { Link } from '@material-ui/core';
import BackArrow from '../BackArrow';

describe('BackArrow utility (components/utils/BackArrow)', () => {
  it('When a link is provided, it should render a clickable and styled link', () => {
    const wrapper = mount(<BackArrow link='/some_page' text='Go to some page' />);
    expect(wrapper.text()).toMatch('Go to some page');
    expect(wrapper.find(Link).prop('href')).toMatch('/some_page');
  });

  it('When a link is provided but no text is given, it should render a clickable and styled link with the default text', () => {
    const wrapper = mount(<BackArrow link='/another_page' />);
    expect(wrapper.text()).toMatch('Voltar');
    expect(wrapper.find(Link).prop('href')).toMatch('/another_page');
  });
});
