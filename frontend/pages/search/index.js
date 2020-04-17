import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Layout from '~/components/Layout';
import FilterToolbar from '~/components/products/filters/FilterToolbar';
import ProductQuery from '~/components/products/ProductQuery';
import { useProductFilters } from '~/hooks/useProductFilters';

const useStyles = makeStyles((theme) => ({
  products: {
    marginBottom: theme.spacing(4),
  },
}));

const SearchPage = () => {
  const classes = useStyles();
  const { delayedSearch, priceRange, sort } = useProductFilters();

  return (
    <Layout title={delayedSearch ? `${delayedSearch} - Pesquisa` : `Pesquisa`} showStoreNav>
      <FilterToolbar />
      <div className={classes.products}>
        <ProductQuery priceRange={priceRange} search={delayedSearch} sort={sort} />
      </div>
    </Layout>
  );
};

export default SearchPage;
