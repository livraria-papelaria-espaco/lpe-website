import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import getConfig from 'next/config';
import Link from 'next/link';
import React from 'react';
import StockBadge from './StockBadge';

const { publicRuntimeConfig } = getConfig();

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const ProductCard = ({ product }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Link href='/product/[slug]' as={`/product/${product.slug}`}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={`${publicRuntimeConfig.apiUrl}${product.images[0].url}`}
            title={product.name}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='h2'>
              {product.name}
            </Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
              {product.shortDescription}
            </Typography>
            <Typography variant='body2' component='p'>
              {product.reference}
            </Typography>
            <Typography variant='body2' component='p'>
              Estado: <StockBadge stock={product.stockStatus} />
            </Typography>
            <Typography variant='body1' color='secondary' component='p'>
              {`${product.price.toFixed(2)}€`}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default ProductCard;
