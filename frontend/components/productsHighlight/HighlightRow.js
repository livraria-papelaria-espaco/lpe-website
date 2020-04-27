import { Paper, Typography, Grid, Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import ProductList from '~/components/products/ProductList';
import ProductCard from '~/components/products/ProductCard';
import Markdown from '~/components/text/Markdown';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  titleContainer: {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 20%, ${theme.palette.primary.light} 70%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
}));

const useStylesContent = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const HighlightRow = ({ row, listName }) => {
  const classes = useStyles();

  const { title, subtitle, content = [] } = row;

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography variant='h2' component='h3'>
          {title}
        </Typography>
        <Typography variant='h4' component='h4'>
          {subtitle}
        </Typography>
      </div>
      <Paper>
        {content.map((contentRow) => (
          <ContentRow key={contentRow.id} row={contentRow} listName={listName} />
        ))}
      </Paper>
    </div>
  );
};

const ContentRow = ({ row, listName }) => {
  const classes = useStylesContent();

  const { __typename, title } = row;

  let content;

  switch (__typename) {
    case 'ComponentHighlightProductList':
      content = <ProductList products={row.products} listName={listName} />;
      break;
    case 'ComponentHighlightProductWithDescription':
      content = (
        <Grid container spacing={3}>
          <Grid item sm={12} md={4} lg={3}>
            <Badge color='secondary' badgeContent={row.badgeNumber ? `#${row.badgeNumber}` : 0}>
              <ProductCard product={row.product} listName={listName} />
            </Badge>
          </Grid>
          <Grid item sm={12} md={8} lg={9}>
            <Markdown>{row.description || ''}</Markdown>
          </Grid>
        </Grid>
      );
      break;
    case 'ComponentHighlightTop10':
      content = <ProductList products={row.products} listName={listName} startAt={row.startAt} />;
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
  __typename: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired, // MongoDB ID
  title: PropTypes.string,
  products: PropTypes.arrayOf(productType),
  product: productType,
  description: PropTypes.string,
  badgeNumber: PropTypes.number,
  startAt: PropTypes.number,
});

HighlightRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired, // MongoDB ID
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    content: PropTypes.arrayOf(contentType),
  }).isRequired,
  listName: PropTypes.string,
};

HighlightRow.defaultProps = {
  listName: 'Product Highlights',
};

ContentRow.propTypes = {
  row: contentType.isRequired,
  listName: PropTypes.string,
};

ContentRow.defaultProps = {
  listName: 'Product Highlights',
};

export default HighlightRow;
