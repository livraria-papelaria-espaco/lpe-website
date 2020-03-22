import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { BackHeader } from 'strapi-helper-plugin';
import OrderInfo from '../../components/OrderInfo';
import Wrapper from './Wrapper';

const OrderPage = () => {
  const { search } = useLocation();
  const { id } = useParams();
  const { push } = useHistory();

  // We can't use the getQueryParameters helper here because the search
  // can contain 'redirectUrl' several times since we can navigate between documents
  const redirectURL = search
    .split('redirectUrl=')
    .filter((_, index) => index !== 0)
    .join('redirectUrl=');

  const redirectToPreviousPage = () => push(redirectURL);

  return (
    <>
      <BackHeader onClick={redirectToPreviousPage} />
      <Wrapper>
        <OrderInfo id={id} />
      </Wrapper>
    </>
  );
};

export default OrderPage;
