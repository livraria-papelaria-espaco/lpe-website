import { Button } from '@material-ui/core';
import React from 'react';
import { useCart } from '~/hooks/useCart';
import CartIcon from '@material-ui/icons/AddShoppingCartRounded';
import { makeStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/DoneRounded';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(3),
    position: 'relative',
    width: 'fit-content',
  },
  button: {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 10%, ${theme.palette.primary.light} 50%)`,
    '&$buttonDisabled': {
      background: theme.palette.action.disabledBackground,
    },
    transition: theme.transitions.create(['all'], { duration: 500 }),
  },
  buttonDisabled: {},
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

const AddToCart = ({ item, ...props }) => {
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
        classes={{
          root: `${classes.button} ${success ? classes.success : ''}`,
          disabled: classes.buttonDisabled,
        }}
        {...props}
      >
        Adicionar ao Carrinho
      </Button>
      {success && <DoneIcon size={24} className={classes.successIcon} />}
    </div>
  );
};

export default AddToCart;
