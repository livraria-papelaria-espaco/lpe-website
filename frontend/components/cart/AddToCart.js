import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CartIcon from '@material-ui/icons/AddShoppingCartRounded';
import DoneIcon from '@material-ui/icons/DoneRounded';
import PropTypes from 'prop-types';
import React from 'react';
import { useCart } from '~/hooks/useCart';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(3),
    position: 'relative',
    width: 'fit-content',
  },
  button: {
    transition: theme.transitions.create(['all'], { duration: 500 }),
  },
  success: {
    background: theme.palette.success.main,
    color: theme.palette.success.main,
    '&:hover': {
      background: theme.palette.success.main,
    },
  },
  successIcon: {
    color: theme.palette.success.contrastText,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const AddToCart = ({ item, disabled }) => {
  const classes = useStyles();
  const { dispatch } = useCart();
  const timer = React.useRef();
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const addToCart = () => {
    dispatch({ type: 'ADD_ITEM', item });
    setSuccess(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSuccess(false), 1000);
  };

  return (
    <div className={classes.wrapper}>
      <Button
        startIcon={<CartIcon />}
        onClick={addToCart}
        variant='contained'
        color='primary'
        className={`${classes.button} ${success ? classes.success : ''}`}
        disabled={disabled}
      >
        Adicionar ao Carrinho
      </Button>
      {success && <DoneIcon size={24} className={classes.successIcon} />}
    </div>
  );
};

AddToCart.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired, // MongoDB ID
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
};

AddToCart.defaultProps = {
  disabled: false,
};

export default AddToCart;
