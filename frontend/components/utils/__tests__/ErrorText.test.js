import React from 'react';
import { shallow } from 'enzyme';
import ErrorText from '../ErrorText';

describe('ErrorText Utility (components/utils/ErrorText)', () => {
  it('Renders without crashing and matches snapshot', () => {
    const wrapper = shallow(<ErrorText />);
    expect(wrapper).toMatchSnapshot();
  });
});
