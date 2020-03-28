import PropTypes from 'prop-types';
import React, { createContext, useContext, useState, useRef } from 'react';

const SearchContext = createContext({});

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState('');
  const [delayedSearch, setDelayedSearch] = useState('');
  const timer = useRef();

  const handleSearchDelay = (value) => {
    setSearch(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDelayedSearch(value);
    }, 500);
  };

  return (
    <SearchContext.Provider value={{ search, setSearch: handleSearchDelay, delayedSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default useSearch;
