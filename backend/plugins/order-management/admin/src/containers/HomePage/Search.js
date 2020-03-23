import React, { useState, useEffect } from 'react';
import { InputSearch } from 'strapi-helper-plugin';
import getTrad from '../../utils/getTrad';

const Search = ({ setSearch }) => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(value);
    }, 500);

    // if this effect runs again, because `value` changed, we remove the previous timeout
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <InputSearch
      autoFocus
      name='search'
      onChange={handleChange}
      placeholder={getTrad(`List.header.inputSearch.placeholder`)}
      style={{ marginTop: '-11px' }}
      value={value}
    />
  );
};

export default Search;
