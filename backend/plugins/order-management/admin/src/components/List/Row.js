import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import getTrad from '../../utils/getTrad';
import {
  Hashtag,
  ListRow,
  OrderItems,
  RowTop,
  StatusBadge,
  Truncate,
  Truncated,
} from './Components';

const getStatusColor = (status) => {
  if (status === 'PROCESSING') return '#e65117';
  if (status === 'SHIPPED') return '#0796b3';
  if (status === 'DELIVERED') return '#07b327';
  if (status === 'WAITING_PAYMENT') return '#eba91c';
  if (status === 'READY_TO_PICKUP') return '#6bb307';
  if (status === 'DELIVERY_FAILED') return '#c21913';
  if (status === 'CANCELLED') return '#de0d64';
  return '#000000';
};

const prettifyOrderItems = (items) =>
  items.map((item) => `${item.name} x${item.quantity}`).join(', ');

const Row = ({ item, handleGoTo }) => {
  return (
    <ListRow
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleGoTo(item.id);
      }}
    >
      <RowTop>
        <p>
          <Hashtag>#</Hashtag>
          {item.invoiceId}
          <StatusBadge color={getStatusColor(item.status)}>
            <FormattedMessage id={getTrad(`List.content.orders.statusBadge.${item.status}`)} />
          </StatusBadge>
        </p>
        <Truncate>
          <Truncated>
            {!item.createdAt
              ? '-'
              : moment
                  .parseZone(item.createdAt)
                  .utc()
                  .format('LLL')}
          </Truncated>
        </Truncate>
        <Truncate>
          <Truncated>{item.user.email}</Truncated>
        </Truncate>
      </RowTop>
      <OrderItems>{prettifyOrderItems(item.orderData.items)}</OrderItems>
    </ListRow>
  );
};

export default Row;
