import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import getTrad from '../../utils/getTrad';

const getStatusColor = (status) => {
  if (status === 'PROCESSING') return '#e65117';
  if (status === 'SHIPPED') return '#0796b3';
  if (status === 'DELIVERED') return '#07b327';
  if (status === 'WAITING_PAYMENT') return '#eba91c';
  if (status === 'READY_TO_PICKUP') return '#6bb307';
  if (status === 'DELIVERY_FAILED') return '#c21913';
  if (status === 'CANCELLED') return '#de0d64';
  if (status === 'WAITING_ITEMS') return '#176cd4';
  return '#000000';
};

const StatusBadge = ({ status, noPadding }) => {
  return (
    <StyledStatusBadge color={getStatusColor(status)} noPadding={noPadding}>
      <FormattedMessage id={getTrad(`List.content.orders.statusBadge.${status}`)} />
    </StyledStatusBadge>
  );
};

const StyledStatusBadge = styled.span`
  margin-left: ${(props) => (props.noPadding ? `0px` : `10px`)};
  background-color: ${(props) => props.color};
  color: #ffffff;
  border-radius: 6px;
  padding: 3px 6px;
`;

export default StatusBadge;
