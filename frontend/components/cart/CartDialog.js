import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const CartDialog = ({ open, onClose, children }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen}>
      <DialogTitle>Carrinho de Compras</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Link href='/checkout'>
          <Button color='primary'>Finalizar compra</Button>
        </Link>
        <Button onClick={onClose} color='primary'>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CartDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

CartDialog.defaultProps = {
  open: false,
  children: null,
};

export default CartDialog;
