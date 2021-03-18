import { useQuery } from '@apollo/client';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import gql from 'graphql-tag';
import Link from 'next/link';
import React, { useState } from 'react';
import { orderStatusMap, paymentGatewayMap } from '~/lib/orders';
import ErrorText from '../utils/ErrorText';
import LoadingPage from '../utils/LoadingPage';

const limit = 10;

const FETCH_ORDERS_QUERY = gql`
  query FETCH_ORDER_LIST($limit: Int!, $start: Int!) {
    ordersCount
    ownOrders(sort: "createdAt:desc", limit: $limit, start: $start) {
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
  const [page, setPage] = useState(0);
  const { loading, error, data, fetchMore } = useQuery(FETCH_ORDERS_QUERY, {
    variables: {
      limit,
      start: 0,
    },
    fetchPolicy: 'cache-and-network',
  });
  const classes = useStyles();
  if (loading && !data) return <LoadingPage height={20} />;
  if (error) return <ErrorText error={error} />;
  const { ownOrders } = data;

  const onLoadMore = () =>
    fetchMore({
      variables: {
        start: ownOrders.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          ordersCount: fetchMoreResult.ordersCount,
          ownOrders: [...prev.ownOrders, ...fetchMoreResult.ownOrders],
        };
      },
    });

  const handleChangePage = (_, newPage) => {
    if (newPage * limit >= data.ownOrders.length) onLoadMore();
    setPage(newPage);
  };

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
          {loading ? (
            [...Array(10)].map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableRow key={`loading-${i}`}>
                <TableCell colSpan={5}>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <>
              {ownOrders.slice(page * limit, page * limit + limit).map((row) => (
                <Link
                  key={row.id}
                  href='/dashboard/order/[orderId]'
                  as={`/dashboard/order/${row.id}`}
                >
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
              {!ownOrders ||
                (ownOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align='center'>
                      Não foram encontradas encomendas
                    </TableCell>
                  </TableRow>
                ))}
            </>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[limit]}
        rowsPerPage={limit}
        component='div'
        count={data ? data.ordersCount : -1}
        page={page}
        onChangePage={handleChangePage}
        backIconButtonText='Página anterior'
        nextIconButtonText='Página seguinte'
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to === -1 ? count : to} de ${count !== -1 ? count : `pelo menos ${to}`}`
        }
      />
    </TableContainer>
  );
};

export default OrderList;
