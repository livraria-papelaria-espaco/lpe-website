import { Badge, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import ProductCard from '~/components/products/ProductCard';
import ProductList from '~/components/products/ProductList';
import Markdown from '~/components/text/Markdown';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  withDescriptionGrow: {
    display: 'flex',
    flexGrow: 1,
  },
}));

const ContentRow = ({ row }) => {
  const classes = useStyles();

  const { __component, title } = row;

  let content;

  switch (__component) {
    case 'highlight.product-list':
      content = <ProductList products={row.products} />;
      break;
    case 'highlight.product-with-description':
      content = (
        <Grid container spacing={3}>
          <Grid item sm={12} md={4} lg={3}>
            <Badge
              color='secondary'
              badgeContent={row.badgeNumber ? `#${row.badgeNumber}` : 0}
              className={classes.withDescriptionGrow}
            >
              <ProductCard
                product={row.product}
                className={classes.withDescriptionGrow}
              />
            </Badge>
          </Grid>
          <Grid item sm={12} md={8} lg={9}>
            <Markdown>{row.description || ''}</Markdown>
          </Grid>
        </Grid>
      );
      break;
    case 'highlight.top-10':
      content = <ProductList products={row.products} startAt={row.startAt} />;
      break;
    default:
      content = null;
  }

  return (
    <div className={classes.root}>
      {title && (
        <Typography variant='h5' gutterBottom>
          {title}
        </Typography>
      )}
      {content}
    </div>
  );
};

const productType = PropTypes.shape({
  id: PropTypes.string.isRequired, // MongoDB ID
  slug: PropTypes.string.isRequired,
  reference: PropTypes.string,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  shortDescription: PropTypes.string,
  type: PropTypes.oneOf(['Livro', 'Outro']).isRequired,
  bookAuthor: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
    })
  ),
});

const contentType = PropTypes.shape({
  __component: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired, // MongoDB ID
  title: PropTypes.string,
  products: PropTypes.arrayOf(productType),
  product: productType,
  description: PropTypes.string,
  badgeNumber: PropTypes.number,
  startAt: PropTypes.number,
});

ContentRow.propTypes = {
  row: contentType.isRequired,
};

export default ContentRow;
