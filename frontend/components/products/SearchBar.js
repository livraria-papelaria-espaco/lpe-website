import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const SearchBar = ({ setValue }) => {
  let timeout = 0;
  const handleChange = (event) => {
    const { value } = event.target;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setValue(value);
    }, 500);
  };

  return (
    <div>
      <TextField label='Search' onChange={handleChange} />
    </div>
  );
};

SearchBar.propTypes = {
  setValue: PropTypes.func.isRequired,
};

export default SearchBar;
