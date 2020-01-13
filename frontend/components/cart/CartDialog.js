import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';

const CartDialog = ({ open, onClose, children }) => (
  <Dialog open={open} onClose={onClose}>
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

export default CartDialog;
