import React from 'react';
import { mount } from 'enzyme';
import Emoji from '../Emoji';

describe('Emoji Utility (components/utils/Emoji)', () => {
  it.each(['😀', '😉', '😏', '❤️', '🦊', '👁️‍🗨️', '✔️'])(
    'When no label is provided, should print a %s emoji and set aria-hidden to true ',
    (emoji) => {
      const wrapper = mount(<Emoji symbol={emoji} />);
      expect(wrapper.text()).toMatch(emoji);
      expect(wrapper.childAt(0).prop('aria-hidden')).toBe('true');
    }
  );
  it.each([
    ['😀', 'Smiley face'],
    ['😉', 'Winking face'],
    ['😏', 'Smirking face'],
    ['❤️', 'Red heart'],
    ['🦊', 'Fox'],
    ['👁️‍🗨️', 'Eye in speech bubble'],
    ['✔️', 'Check mark'],
  ])(
    'When a label is provided, should print a %s emoji with the "%s" label and set aria-hidden to false',
    (emoji, label) => {
      const wrapper = mount(<Emoji symbol={emoji} label={label} />);
      expect(wrapper.text()).toMatch(emoji);
      expect(wrapper.childAt(0).prop('aria-label')).toBe(label);
      expect(wrapper.childAt(0).prop('aria-hidden')).toBe('false');
    }
  );
});
