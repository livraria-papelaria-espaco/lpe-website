import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    width: '100%',
    height: (props) => `${props.height}vh`,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LoadingPage = ({ height }) => {
  const classes = useStyles({ height });
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
};

LoadingPage.propTypes = {
  height: PropTypes.number,
};

LoadingPage.defaultProps = {
  height: 70,
};

export default LoadingPage;
