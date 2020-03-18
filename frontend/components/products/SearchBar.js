import React from 'react';
import { TextField } from '@material-ui/core';

const SearchBar = ({ setValue }) => {
  let timeout = 0;
  const handleChange = (event) => {
    const value = event.target.value;
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

export default SearchBar;
