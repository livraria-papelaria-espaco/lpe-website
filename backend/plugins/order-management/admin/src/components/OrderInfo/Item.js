import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import getTrad from '../../utils/getTrad';
import { Field } from './Components';

const Item = ({ item }) => {
  return (
    <Field className='col-sm-12'>
      <ItemPrimary>
        {item.name} x{item.quantity}
      </ItemPrimary>
      <ItemSecondary>
        <FormattedMessage
          id={getTrad(`OrderPage.content.field.item.ref`)}
          values={{ ref: item.ref }}
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
    </Field>
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

export default Item;
