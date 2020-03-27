import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
    height: '70vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LoadingPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
};

export default LoadingPage;
