import { useQuery } from '@apollo/react-hooks';
import { IconButton, Typography } from '@material-ui/core';
import getConfig from 'next/config';
import AddIcon from '@material-ui/icons/AddRounded';
import RemoveIcon from '@material-ui/icons/RemoveRounded';
import DeleteIcon from '@material-ui/icons/RemoveShoppingCartRounded';
import { Skeleton } from '@material-ui/lab';
import gql from 'graphql-tag';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const { publicRuntimeConfig } = getConfig();

const IMAGE_SIZE = 100;

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
    maxWidth: '100%',
    maxHeight: '100%',
  },
  text: {
    marginLeft: theme.spacing(2),
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

  return (
    <div className={classes.root}>
      <div className={classes.imageContainer}>
        <img
          src={`${publicRuntimeConfig.apiUrl}${data.product.images[0].url}`}
          className={classes.image}
        />
      </div>
      <div className={classes.text}>
        <Typography variant='h6' component='p'>
          {data.product.name}
        </Typography>
        <Typography variant='caption' component='p' color='textSecondary'>
          Referência: {data.product.reference}
        </Typography>
        <Typography variant='body1'>
          {data.product.price.toFixed(2)}€
          <Typography variant='body1' color='textSecondary' component='span'>
            {` x${item.get('quantity')}`}
          </Typography>
        </Typography>
        {dispatch && (
          <>
            <IconButton onClick={decreaseQuantity} disabled={item.get('quantity') <= 1}>
              <RemoveIcon />
            </IconButton>
            <IconButton onClick={increaseQuantity}>
              <AddIcon />
            </IconButton>
            <IconButton onClick={removeItem}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </div>
    </div>
  );
};

const GET_CART_PRODUCT_INFO = gql`
  query GET_CART_PRODUCT_INFO($id: ID!) {
    product(id: $id) {
      name
      reference
      price
      images(limit: 1) {
        url
      }
    }
  }
`;

export default CartItem;
