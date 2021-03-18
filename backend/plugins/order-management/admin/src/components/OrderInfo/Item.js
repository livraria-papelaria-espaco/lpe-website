import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import getTrad from '../../utils/getTrad';
import { ItemsField } from './Components';
import { InputNumber, Button, request } from 'strapi-helper-plugin';

const Item = ({ item, orderId, setData }) => {
  const [restockCount, setRestockCount] = useState(item.needsRestock);
  const [loading, setLoading] = useState(false);

  const handleRestockCountChange = (e) => {
    setRestockCount(e.target.value);
  };

  const updateRestockCount = async () => {
    setLoading(true);
    try {
      const response = await request(`/order-management/order/updaterestockcount/${orderId}`, {
        method: 'POST',
        body: {
          id: item.id,
          count: parseInt(restockCount, 10),
        },
      });
      setData(response);
      strapi.notification.toggle({
        message: {
          id: getTrad(`Action.success.order.changeRestockCount`),
          defaultMessage: 'Restock item amount updated successfuly.',
        },
      });
    } catch (e) {
      console.error(e);
      strapi.notification.toggle({
        type: 'warning',
        message: {
          id: getTrad(`Action.error.order.changeRestockCount`),
          defaultMessage: 'Failed to update restock item amount.',
        },
      });
    }
    setLoading(false);
  };

  return (
    <ItemsField className='col-sm-12'>
      <div>
        <ItemPrimary>
          {item.name} x{item.quantity}
        </ItemPrimary>
        <ItemSecondary>
          <FormattedMessage
            id={getTrad(`OrderPage.content.field.item.ref`)}
            values={{ ref: item.reference }}
          />
        </ItemSecondary>
        {item.quantity !== 1 && (
          <ItemPrimary>
            <FormattedMessage
              id={getTrad(`OrderPage.content.field.item.priceUnity`)}
              values={{ price: item.priceUnity.toFixed(2) }}
            />
          </ItemPrimary>
        )}
        <ItemPrimary>
          <FormattedMessage
            id={getTrad(`OrderPage.content.field.item.price`)}
            values={{ price: item.price.toFixed(2) }}
          />
        </ItemPrimary>
        {item.needsRestock > 0 && (
          <ItemPrimary>
            <RestockWarning />
            <FormattedMessage
              id={getTrad(
                `OrderPage.content.field.item.restock.${
                  item.needsRestock === 1 ? 'singular' : 'plural'
                }`
              )}
              values={{ count: item.needsRestock }}
            />
          </ItemPrimary>
        )}
      </div>
      <InputContainer>
        <SmallInputNumber
          name='Quantidade fora de stock'
          value={restockCount}
          onChange={handleRestockCountChange}
          step={1}
        />
        <Button
          primary
          label={getTrad(`OrderPage.content.field.item.restock.update`)}
          loader={loading}
          onClick={updateRestockCount}
        />
      </InputContainer>
    </ItemsField>
  );
};

const ItemPrimary = styled.p`
  margin-bottom: 0.2rem;
  color: #000;
`;

const ItemSecondary = styled.p`
  margin-bottom: 0.2rem;
  color: #888;
`;

const RestockWarning = styled.span`
  &:after {
    content: '\f071';
    font-family: 'FontAwesome';
    color: #fd7e14;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
`;

const SmallInputNumber = styled(InputNumber)`
  width: 70px;
  margin-top: 0px;
  margin-right: 16px;
`;

export default Item;
