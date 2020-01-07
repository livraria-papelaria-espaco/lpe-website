import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react';

const CartSummary = ({ open, onClose, children }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Carrinho de Compras</DialogTitle>
    <DialogContent>{children}</DialogContent>
    <DialogActions>
      <Button color='primary'>Finalizar compra</Button>
      <Button onClick={onClose} color='primary'>
        Fechar
      </Button>
    </DialogActions>
  </Dialog>
);

export default CartSummary;
