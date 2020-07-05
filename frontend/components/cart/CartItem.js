import { useQuery } from '@apollo/react-hooks';
import { Button, Typography } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddRounded';
import RemoveIcon from '@material-ui/icons/RemoveRounded';
import DeleteIcon from '@material-ui/icons/RemoveShoppingCartRounded';
import { Skeleton } from '@material-ui/lab';
import gql from 'graphql-tag';
import { Map } from 'immutable';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import LogoSvg from '~/assets/logo.svg';

const IMAGE_SIZE = 100;

const GET_CART_PRODUCT_INFO = gql`
  query GET_CART_PRODUCT_INFO($id: ID!) {
    product(id: $id) {
      name
      slug
      reference
      price
      type
      images(limit: 1) {
        url
      }
    }
    globalDiscount {
      discounts {
        __typename
        ... on ComponentDiscountsProductTypeDiscount {
          percentage
          type
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: theme.spacing(1),
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    textAlign: 'center',
  },
  image: {
    fill: fade(theme.palette.primary.main, 0.5),
    maxWidth: '100%',
    maxHeight: '100%',
    cursor: 'pointer',
  },
  text: {
    marginLeft: theme.spacing(2),
  },
  name: {
    cursor: 'pointer',
  },
  discountOld: {
    color: theme.palette.error.dark,
    textDecoration: 'line-through',
  },
}));

const CartItem = ({ item, dispatch }) => {
  const { data, loading } = useQuery(GET_CART_PRODUCT_INFO, { variables: { id: item.get('id') } });
  const classes = useStyles();

  const increaseQuantity = () => {
    dispatch({ type: 'INCREASE_QUANTITY', id: item.get('id') });
  };

  const decreaseQuantity = () => {
    dispatch({ type: 'DECREASE_QUANTITY', id: item.get('id') });
  };

  const removeItem = () => {
    dispatch({ type: 'REMOVE_ITEM', id: item.get('id') });
  };

  if (loading || !data)
    return (
      <div className={classes.root}>
        <div className={classes.imageContainer}>
          <Skeleton variant='rect' width={IMAGE_SIZE} height={IMAGE_SIZE} />
        </div>
        <div className={classes.text}>
          <Skeleton width={100} />
          <Skeleton width={100} />
          <Skeleton width={100} />
          <Skeleton width={100} />
        </div>
      </div>
    );

  const discountPercent = Math.max(
    0,
    ...data.globalDiscount.discounts.map((discount) => {
      // eslint-disable-next-line no-underscore-dangle
      if (discount.__typename === 'ComponentDiscountsProductTypeDiscount')
        return discount.type === data.product.type ? discount.percentage : 0;
      return 0;
    })
  );

  const getImage = () => {
    if (data.product.images && data.product.images[0] && data.product.images[0].url)
      return (
        <img
          src={`${process.env.apiUrl}${data.product.images[0].url}`}
          alt={data.product.name}
          className={classes.image}
        />
      );
    return (
      <span>
        <LogoSvg className={classes.image} />
      </span>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.imageContainer}>
        <Link href='/product/[slug]' as={`/product/${data.product.slug}`}>
          {getImage()}
        </Link>
      </div>
      <div className={classes.text}>
        <Link href='/product/[slug]' as={`/product/${data.product.slug}`}>
          <Typography variant='h6' component='p' className={classes.name}>
            {data.product.name}
          </Typography>
        </Link>
        <Typography variant='caption' component='p' color='textSecondary'>
          Referência: {data.product.reference}
        </Typography>
        <Typography variant='body1'>
          {discountPercent > 0 && (
            <span className={classes.discountOld}>{`${data.product.price.toFixed(2)}€ `}</span>
          )}
          {`${(data.product.price * ((100 - (discountPercent || 0)) / 100)).toFixed(2)}€ `}
          <Typography variant='body1' color='textSecondary' component='span'>
            {` x${item.get('quantity')}`}
          </Typography>
        </Typography>
        {dispatch && (
          <>
            <Button onClick={decreaseQuantity} disabled={item.get('quantity') <= 1} size='small'>
              <RemoveIcon />
            </Button>
            <Button onClick={increaseQuantity} size='small'>
              <AddIcon />
            </Button>
            <Button onClick={removeItem} size='small'>
              <DeleteIcon />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  dispatch: PropTypes.func,
};

CartItem.defaultProps = {
  dispatch: undefined,
};

export default CartItem;
