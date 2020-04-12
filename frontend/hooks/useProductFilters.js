import PropTypes from 'prop-types';
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

const defaultPriceRange = [0, 100];
const ProductFiltersContext = createContext({});

export const useProductFilters = () => useContext(ProductFiltersContext);

export const ProductFiltersProvider = ({ children }) => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [delayedSearch, setDelayedSearch] = useState('');
  const [priceRange, setPriceRange] = useState(defaultPriceRange);
  const [sort, setSort] = useState('updatedAt:desc');
  const timer = useRef();

  useEffect(() => {
    setSearch(router.query.search || '');
    setDelayedSearch(router.query.search || '');
  }, [router.query.search]);

  useEffect(() => {
    setPriceRange([
      parseInt(router.query.minPrice || defaultPriceRange[0], 10),
      parseInt(router.query.maxPrice || defaultPriceRange[1], 10),
    ]);
  }, [router.query.minPrice, router.query.maxPrice]);

  useEffect(() => {
    setSort(router.query.sort || 'updatedAt:desc');
  }, [router.query.sort]);

  const handleSearchDelay = (value) => {
    setSearch(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, search: value },
        },
        {
          pathname: router.pathname.indexOf('[category]')
            ? router.pathname.replace('[category]', router.query.category)
            : router.pathname,
          query: { ...router.query, search: value },
        },
        { shallow: true }
      );
    }, 500);
  };

  const handlePriceRange = (value) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, minPrice: value[0], maxPrice: value[1] },
      },
      {
        pathname: router.pathname.indexOf('[category]')
          ? router.pathname.replace('[category]', router.query.category)
          : router.pathname,
        query: { ...router.query, minPrice: value[0], maxPrice: value[1] },
      }
    );
  };

  const handleSort = (value) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, sort: value },
      },
      {
        pathname: router.pathname.indexOf('[category]')
          ? router.pathname.replace('[category]', router.query.category)
          : router.pathname,
        query: { ...router.query, sort: value },
      }
    );
  };

  return (
    <ProductFiltersContext.Provider
      value={{
        search,
        setSearch: handleSearchDelay,
        delayedSearch,
        priceRange,
        setPriceRange: handlePriceRange,
        sort,
        setSort: handleSort,
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
