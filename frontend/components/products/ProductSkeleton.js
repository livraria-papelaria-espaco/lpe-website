import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    marginBottom: theme.spacing(1),
    margin: 'auto',
  },
}));

const ProductSkeleton = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Skeleton variant='rect' width={150} height={150} className={classes.image} />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
};

export default ProductSkeleton;
