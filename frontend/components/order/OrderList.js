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
import { orderStatusMap, paymentGatewayMap } from '~/lib/orders';
import ErrorText from '../utils/ErrorText';
import LoadingPage from '../utils/LoadingPage';

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
  tableRow: {
    cursor: 'pointer',
  },
});

const OrderList = () => {
  const { loading, error, data } = useQuery(FETCH_ORDERS_QUERY);
  const classes = useStyles();
  if (loading) return <LoadingPage height={20} />;
  if (error) return <ErrorText error={error} />;
  const { orders } = data;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Encomenda #</TableCell>
            <TableCell>Meio de pagamento</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align='right'>Preço total</TableCell>
            <TableCell align='right'>Última atualização</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row) => (
            <Link key={row.id} href='/dashboard/order/[orderId]' as={`/dashboard/order/${row.id}`}>
              <TableRow hover className={classes.tableRow}>
                <TableCell component='th' scope='row'>
                  {row.invoiceId}
                </TableCell>
                <TableCell>{paymentGatewayMap[row.paymentGateway] || 'Desconhecido'}</TableCell>
                <TableCell>{orderStatusMap[row.status] || 'Desconhecido'}</TableCell>
                <TableCell align='right'>{row.price.toFixed(2)} €</TableCell>
                <TableCell align='right'>
                  {new Date(row.updatedAt).toLocaleString('pt-PT')}
                </TableCell>
              </TableRow>
            </Link>
          ))}
          {!orders ||
            (orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  Não foram encontradas encomendas
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderList;
