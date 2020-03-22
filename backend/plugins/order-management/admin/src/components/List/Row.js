import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'strapi-helper-plugin';
import getTrad from '../../utils/getTrad';
import StatusBadge from '../StatusBadge';
import {
  Hashtag,
  ListRow,
  OrderItems,
  RestockWarning,
  RowTop,
  Truncate,
  Truncated,
} from './Components';

const prettifyOrderItems = (items) =>
  items.map((item) => `${item.name} x${item.quantity}`).join(', ');

const Row = ({ item, handleGoTo, openNextStepWarning }) => {
  const handleNextStepButton = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openNextStepWarning({ id: item.id, status: item.status });
  };

  const needsRestock = item.orderData.items.some((item) => item.needsRestock > 0);

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
          <StatusBadge status={item.status} />
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
        {(item.status === 'READY_TO_PICKUP' ||
          item.status === 'PROCESSING' ||
          item.status === 'WAITING_ITEMS') && (
          <Button disabled={needsRestock} secondaryHotline onClick={handleNextStepButton}>
            <FormattedMessage
              id={getTrad(
                `List.content.orders.${
                  item.status === 'READY_TO_PICKUP'
                    ? `markAsPickedUp`
                    : item.storePickup
                    ? `markAsReadyToPickup`
                    : `markAsShipped`
                }`
              )}
            />
          </Button>
        )}
      </RowTop>
      <OrderItems>
        {prettifyOrderItems(item.orderData.items)}
        {needsRestock && <RestockWarning />}
      </OrderItems>
    </ListRow>
  );
};

export default Row;
