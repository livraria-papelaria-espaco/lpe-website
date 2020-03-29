import PropTypes from 'prop-types';
import React, { createContext, useContext, useState, useRef } from 'react';

const defaultPriceRange = [0, 100];
const ProductFiltersContext = createContext({});

export const useProductFilters = () => useContext(ProductFiltersContext);

export const ProductFiltersProvider = ({ children }) => {
  const [search, setSearch] = useState('');
  const [delayedSearch, setDelayedSearch] = useState('');
  const [priceRange, setPriceRange] = useState(defaultPriceRange);
  const [sort, setSort] = useState('updatedAt:desc');
  const timer = useRef();

  const handleSearchDelay = (value) => {
    setSearch(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDelayedSearch(value);
    }, 500);
  };

  return (
    <ProductFiltersContext.Provider
      value={{
        search,
        setSearch: handleSearchDelay,
        delayedSearch,
        priceRange,
        setPriceRange,
        sort,
        setSort,
      }}
    >
      {children}
    </ProductFiltersContext.Provider>
  );
};

ProductFiltersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default useProductFilters;
