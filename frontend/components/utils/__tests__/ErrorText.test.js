import React from 'react';
import { shallow } from 'enzyme';
import ErrorText from '../ErrorText';

describe('ErrorText Utility (components/utils/ErrorText)', () => {
  it('Renders without crashing and matches snapshot', () => {
    const wrapper = shallow(<ErrorText />);
    expect(wrapper).toMatchSnapshot();
  });
  it('Should call console.error if an error is provided and the environement is not production', () => {
    const fn = jest.spyOn(global.console, 'error').mockImplementation(() => {});
    const error = 'Lorem Ipsum Error';

    shallow(<ErrorText error={error} />);

    expect(fn).toHaveBeenCalledWith(error);

    fn.mockRestore();
  });
});
