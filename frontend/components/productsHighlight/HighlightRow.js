import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import ProductList from '../products/ProductList';

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
    padding: theme.spacing(2),
  },
}));

const HighlightRow = ({ row, listName }) => {
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
        <ProductList products={products} listName={listName} />
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
  listName: PropTypes.string,
};

HighlightRow.defaultProps = {
  listName: 'Product Highlights',
};

export default HighlightRow;
