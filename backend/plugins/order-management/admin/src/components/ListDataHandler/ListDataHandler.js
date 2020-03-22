import React, { useEffect, useState } from 'react';
import List from '../List';
import { request } from 'strapi-helper-plugin';

const orderType = 'application::order.order';
const limit = 30;

const ListDataHandler = ({ type }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    let query;
    if (type === 'pending')
      query = '_sort=createdAt:ASC&status_in=PROCESSING&status_in=DELIVERY_FAILED';
    else if (type === 'waitingItems') query = '_sort=createdAt:ASC&status=WAITING_ITEMS';
    else if (type === 'pickup') query = '_sort=createdAt:ASC&status=READY_TO_PICKUP';
    else
      query =
        '_sort=createdAt:DESC&status_in=WAITING_PAYMENT&status_in=SHIPPED&status_in=DELIVERED&status_in=CANCELLED';

    setLoading(true);
    const countResponse = await request(`/content-manager/explorer/${orderType}/count?${query}`);
    setCount(countResponse.count);

    const response = await request(
      `/content-manager/explorer/${orderType}?_limit=${limit}&_start=${page * limit}&${query}`
    );
    setData(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [type, page]);

  return (
    <List
      data={data}
      page={page}
      setPage={setPage}
      count={count}
      loading={loading}
      refetch={fetchData}
    />
  );
};

export default ListDataHandler;
