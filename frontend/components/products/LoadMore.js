import { Button, CircularProgress, Fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
  placeholder: {
    height: 40,
    marginBottom: theme.spacing(2),
  },
}));

const LoadMore = ({ onClick, hide, loading }) => {
  const classes = useStyles();

  if (hide) return null;
  return (
    <div className={classes.root}>
      <div className={classes.placeholder}>
        <Fade
          in={loading}
          style={{
            transitionDelay: loading ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <CircularProgress />
        </Fade>
      </div>
      <Button variant='outlined' color='primary' onClick={onClick} disabled={loading}>
        Carregar mais produtos
      </Button>
    </div>
  );
};

LoadMore.propTypes = {
  onClick: PropTypes.func.isRequired,
  hide: PropTypes.bool,
  loading: PropTypes.bool,
};

LoadMore.defaultProps = {
  hide: false,
  loading: false,
};

export default LoadMore;
