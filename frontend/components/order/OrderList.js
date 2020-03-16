import { useQuery } from '@apollo/react-hooks';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import Link from 'next/link';
import React from 'react';

const FETCH_ORDERS_QUERY = gql`
  query FETCH_ORDER_LIST {
    orders(sort: "createdAt:desc") {
      id
      invoiceId
      paymentGateway
      status
      updatedAt
      price
    }
  }
`;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const OrderList = () => {
  const { loading, error, data } = useQuery(FETCH_ORDERS_QUERY);
  const classes = useStyles();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;
  const orders = data.orders;
  if (!orders) return <p>No orders</p>;
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Encomenda #</TableCell>
            <TableCell align='right'>Meio de pagamento</TableCell>
            <TableCell align='right'>Estado</TableCell>
            <TableCell align='right'>Custo total</TableCell>
            <TableCell align='right'>Última atualização</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row) => (
            <Link key={row.id} href='/dashboard/order/[orderId]' as={`/dashboard/order/${row.id}`}>
              <TableRow>
                <TableCell component='th' scope='row'>
                  {row.invoiceId}
                </TableCell>
                <TableCell align='right'>{row.paymentGateway}</TableCell>
                <TableCell align='right'>{row.status}</TableCell>
                <TableCell align='right'>{row.price}</TableCell>
                <TableCell align='right'>{row.updatedAt}</TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderList;
