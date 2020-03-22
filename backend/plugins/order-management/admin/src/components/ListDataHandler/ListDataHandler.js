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

  useEffect(() => {
    let ignore = false;
    let clause;
    if (type === 'pending')
      clause = '_sort=createdAt:ASC&status_in=PROCESSING&status_in=DELIVERY_FAILED';
    else if (type === 'pickup') clause = '_sort=createdAt:ASC&status=READY_TO_PICKUP';
    else
      clause =
        '_sort=createdAt:DESC&status_in=WAITING_PAYMENT&status_in=SHIPPED&status_in=DELIVERED&status_in=CANCELLED';

    const fetchData = async () => {
      setLoading(true);
      const countResponse = await request(`/content-manager/explorer/${orderType}/count?${clause}`);
      if (ignore) return;
      setCount(countResponse.count);

      const response = await request(
        `/content-manager/explorer/${orderType}?_limit=${limit}&_start=${page * limit}&${clause}`,
        {
          method: 'GET',
        }
      );
      if (ignore) return;
      setData(response);
      setLoading(false);
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, [type]);

  return <List data={data} page={page} setPage={setPage} count={count} loading={loading} />;
};

export default ListDataHandler;
