import { Typography } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import LogoSvg from '~/assets/logo.svg';
import StockBadge from './StockBadge';
import StockLoader from './StockLoader';

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
  link: {
    color: 'unset',
    textDecoration: 'none',
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
  skeleton: {
    display: 'inline-block',
    marginLeft: theme.spacing(1),
  },
  discountOld: {
    color: theme.palette.error.dark,
    textDecoration: 'line-through',
  },
  productTitle: {
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
}));

const ProductCard = ({ product, listName, className }) => {
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
      <a className={`${classes.link} ${className}`}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div className={classes.root} onClick={handleGA}>
          <div className={classes.imageContainer}>{getImage()}</div>
          <Typography variant='h5' component='h2' className={classes.productTitle}>
            {product.name}
          </Typography>
          {product.bookAuthor && (
            <Typography
              variant='subtitle1'
              component='h3'
              color='textSecondary'
              className={classes.bookAuthor}
            >
              {product.bookAuthor}
            </Typography>
          )}
          <Typography gutterBottom variant='caption' component='p'>
            {`${product.type === 'Livro' ? 'ISBN' : 'Ref'}: ${product.reference || '-'}`}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {product.shortDescription || ''}
          </Typography>
          <Typography variant='body1' component='p'>
            {product.discountPercent > 0 && (
              <span className={classes.discountOld}>{`${product.price.toFixed(2)}€ `}</span>
            )}
            {`${(product.price * (1 - (product.discountPercent || 0) / 100)).toFixed(2)}€ `}
            <StockLoader product={product.slug} skeletonClassName={classes.skeleton}>
              {(stockStatus) => <StockBadge stock={stockStatus} />}
            </StockLoader>
          </Typography>
        </div>
      </a>
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
    bookAuthor: PropTypes.string,
    reference: PropTypes.string,
    shortDescription: PropTypes.string,
    price: PropTypes.number.isRequired,
    stockStatus: PropTypes.oneOf(['IN_STOCK', 'LOW_STOCK', 'ORDER_ONLY', 'UNAVAILABLE']),
    discountPercent: PropTypes.number,
  }).isRequired,
  listName: PropTypes.string,
  className: PropTypes.string,
};

ProductCard.defaultProps = {
  listName: 'Unknown',
  className: '',
};

export default ProductCard;
