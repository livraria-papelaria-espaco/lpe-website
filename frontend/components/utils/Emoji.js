import PropTypes from 'prop-types';
import React from 'react';

const Emoji = ({ label, symbol }) => (
  <span
    className='emoji'
    role='img'
    aria-label={label ? label : ''}
    aria-hidden={label ? 'false' : 'true'}
  >
    {symbol}
  </span>
);

Emoji.propTypes = {
  label: PropTypes.string,
  symbol: PropTypes.string.isRequired,
};

Emoji.defaultProps = {
  label: '',
};

export default Emoji;
