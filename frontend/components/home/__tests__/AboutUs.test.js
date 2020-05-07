import React from 'react';
import { shallow } from 'enzyme';
import AboutUs from '../AboutUs';

describe('AboutUs (components/home/AboutUs)', () => {
  it('Should render correctly and match snapshot', () => {
    const text = 'Lorem Ipsum Text';

    const wrapper = shallow(<AboutUs text={text} />);

    expect(wrapper).toMatchSnapshot();
  });
});
