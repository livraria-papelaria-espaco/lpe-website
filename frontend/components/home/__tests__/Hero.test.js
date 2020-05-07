import { shallow } from 'enzyme';
import React from 'react';
import Hero from '../Hero';

describe('Hero static component (components/home/Hero)', () => {
  it('Should render correctly and match snapshot', () => {
    process.env.appbar = {
      desktopHeight: 96,
    };

    const wrapper = shallow(<Hero />);

    expect(wrapper).toMatchSnapshot();
  });
});
