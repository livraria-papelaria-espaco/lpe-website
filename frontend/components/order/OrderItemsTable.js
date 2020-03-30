import {
  Link as MUILink,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/WarningRounded';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  productCell: {
    display: 'flex',
    alignItems: 'center',
  },
  textDiv: { marginRight: theme.spacing(1) },
}));

const OrderItemsTable = ({ items }) => {
  const classes = useStyles();

  const totalPrice = items.reduce((i, v) => i + v.price, 0);

  const rows = items.map((v) => (
    <TableRow key={v.slug} hover>
      <TableCell className={classes.productCell}>
        <div className={classes.textDiv}>
          <Link href='/product/[slug]' as={`/product/${v.slug}`} passHref>
            <MUILink color='inherit'>{v.name}</MUILink>
          </Link>
          <Typography variant='caption' component='p' color='textSecondary'>
            {v.reference}
          </Typography>
        </div>
        {v.needsRestock > 0 && <RestockWarning />}
      </TableCell>
      <TableCell align='right'>{v.quantity}</TableCell>
      <TableCell align='right'>{v.priceUnity.toFixed(2)} €</TableCell>
      <TableCell align='right'>{v.price.toFixed(2)} €</TableCell>
    </TableRow>
  ));

  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>Produto</TableCell>
          <TableCell align='right'>Quantidade</TableCell>
          <TableCell align='right'>Preço Unitário</TableCell>
          <TableCell align='right'>Subtotal</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows}
        <TableRow>
          <TableCell colSpan={2} />
          <TableCell>Preço c/ IVA</TableCell>
          <TableCell align='right'>{totalPrice.toFixed(2)} €</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

OrderItemsTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      reference: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      priceUnity: PropTypes.number.isRequired,
      needsRestock: PropTypes.number,
    })
  ).isRequired,
};

const RestockWarning = () => (
  <Tooltip
    title='Este produto não está em stock na nossa loja. Por este motivo, terá que aguardar que o mesmo nos seja entregue.'
    placement='right'
    arrow
  >
    <WarningIcon color='error' />
  </Tooltip>
);

export default OrderItemsTable;
