import React from 'react';
import { shallow } from 'enzyme';
import LoadingPage from '../LoadingPage';

describe('LoadingPage Utility (components/utils/LoadingPage)', () => {
  it('Renders without crashing and matches snapshot', () => {
    const wrapper = shallow(<LoadingPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
