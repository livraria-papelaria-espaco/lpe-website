import React, { useEffect, useState } from 'react';
import { PageFooter, request } from 'strapi-helper-plugin';
import List from '../List';

const orderType = 'application::order.order';

const ListDataHandler = ({ type }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
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
  }, [type, page, limit]);

  return (
    <>
      <List data={data} count={count} loading={loading} refetch={fetchData} />
      <div className='col-md-12'>
        <PageFooter
          count={count}
          context={{ emitEvent: () => {} }}
          onChangeParams={({ target: { name, value } }) => {
            if (name === 'params._page') setPage(value - 1);
            if (name === 'params._limit') setLimit(value);
          }}
          params={{
            _limit: limit,
            _page: page + 1,
          }}
        />
      </div>
    </>
  );
};

export default ListDataHandler;
