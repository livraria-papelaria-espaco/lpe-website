import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import ProductCard from '~/components/products/ProductCard';

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
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  productsItem: {
    margin: theme.spacing(3),
    flexGrow: 1,
    flexBasis: 200,
    minWidth: 200,
    width: 200,
  },
}));

const HighlightRow = ({ row }) => {
  const classes = useStyles();

  const { title, subtitle, products } = row;

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
      <Paper className={classes.container}>
        {products.map((product) => (
          <div key={product.id} className={classes.productsItem}>
            <ProductCard product={product} />
          </div>
        ))}
      </Paper>
    </div>
  );
};

HighlightRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired, // MongoDB ID
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired, // MongoDB ID
        slug: PropTypes.string.isRequired,
        reference: PropTypes.string,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        shortDescription: PropTypes.string,
        type: PropTypes.oneOf(['Livro', 'Outro']).isRequired,
        bookInfo: PropTypes.shape({
          author: PropTypes.string,
        }),
        images: PropTypes.arrayOf(
          PropTypes.shape({
            url: PropTypes.string,
          })
        ),
      })
    ),
  }).isRequired,
};

export default HighlightRow;
