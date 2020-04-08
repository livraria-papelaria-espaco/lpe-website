import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import getTrad from '../../utils/getTrad';

const getColor = (status) => {
  if (status === 'IN_STORE') return '#1ac946';
  if (status === 'MB') return '#2968a9';
  if (status === 'MBWAY') return '#f10107';
  if (status === 'BANK_TRANSFER') return '#1ed4ad';
  return '#000000';
};

const PaymentGatewayBadge = ({ gateway }) => {
  return (
    <StyledBadge color={getColor(gateway)}>
      <FormattedMessage id={getTrad(`OrderPage.content.gatewayBadge.${gateway}`)} />
    </StyledBadge>
  );
};

const StyledBadge = styled.span`
  background-color: ${(props) => props.color};
  color: #ffffff;
  border-radius: 6px;
  padding: 3px 6px;
`;

export default PaymentGatewayBadge;
