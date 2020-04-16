import { Typography } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import LogoSvg from '~/assets/logo.svg';
import StockBadge from './StockBadge';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    margin: 'auto',
    height: '100%',
    '&:hover': {
      backgroundColor: fade(theme.palette.secondary.light, theme.palette.action.hoverOpacity),
    },
  },
  imageContainer: {
    textAlign: 'center',
    height: 150,
    marginBottom: theme.spacing(1),
  },
  image: {
    fill: fade(theme.palette.primary.main, 0.5),
    maxWidth: '100%',
    maxHeight: '100%',
  },
  bookAuthor: {
    lineHeight: 1.3,
    paddingBottom: theme.spacing(1),
  },
}));

const ProductCard = ({ product, listName }) => {
  const classes = useStyles();

  const getImage = () => {
    if (product.images && product.images[0] && product.images[0].url)
      return (
        <img
          src={`${process.env.apiUrl}${product.images[0].url}`}
          alt={product.name}
          className={classes.image}
        />
      );
    return <LogoSvg className={classes.image} />;
  };

  const handleGA = () => {
    if (window && window.gtag) {
      window.gtag('event', 'select_content', {
        content_type: 'product',
        items: [
          {
            id: product.id,
            name: product.name,
            list_name: listName,
            price: product.price,
          },
        ],
      });
    }
  };

  return (
    <Link href='/product/[slug]' as={`/product/${product.slug}`}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div className={classes.root} onClick={handleGA}>
        <div className={classes.imageContainer}>{getImage()}</div>
        <Typography variant='h5' component='h2'>
          {product.name}
        </Typography>
        {product.type === 'Livro' && product.bookInfo && product.bookInfo.author && (
          <Typography
            variant='subtitle1'
            component='h3'
            color='textSecondary'
            className={classes.bookAuthor}
          >
            {product.bookInfo.author}
          </Typography>
        )}
        <Typography gutterBottom variant='caption' component='p'>
          {`${product.type === 'Livro' ? 'ISBN' : 'Ref'}: ${product.reference || '-'}`}
        </Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          {product.shortDescription || ''}
        </Typography>
        <Typography variant='body1' component='p' color='secondary'>
          {`${product.price.toFixed(2)}€ `}
          {product.stockStatus && <StockBadge stock={product.stockStatus} />}
        </Typography>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired, // MongoDB ID
    images: PropTypes.oneOfType([PropTypes.array, PropTypes.oneOf([null])]),
    type: PropTypes.oneOf(['Livro', 'Outro']).isRequired,
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    bookInfo: PropTypes.shape({
      author: PropTypes.string,
    }),
    reference: PropTypes.string,
    shortDescription: PropTypes.string,
    price: PropTypes.number.isRequired,
    stockStatus: PropTypes.oneOf(['IN_STOCK', 'LOW_STOCK', 'ORDER_ONLY', 'UNAVAILABLE']),
  }).isRequired,
  listName: PropTypes.string,
};

ProductCard.defaultProps = {
  listName: 'Unknown',
};

export default ProductCard;
