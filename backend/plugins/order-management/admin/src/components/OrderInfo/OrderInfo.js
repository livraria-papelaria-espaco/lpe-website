import { Header } from '@buffetjs/custom';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { LoadingIndicator, request, useGlobalContext } from 'strapi-helper-plugin';
import getTrad from '../../utils/getTrad';
import PaymentGatewayBadge from '../PaymentGatewayBadge/PaymentGatewayBadge';
import StatusBadge from '../StatusBadge';
import { LoadingWrapper, Wrapper } from './Components';
import Field from './Field';
import Item from './Item';
import SectionTitle from './SectionTitle';

const orderType = 'application::order.order';

const parseDate = (date) =>
  date
    ? moment
        .parseZone(date)
        .utc()
        .format('LLL')
    : '-';

const OrderInfo = ({ id }) => {
  const { formatMessage } = useGlobalContext();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      const response = await request(`/content-manager/explorer/${orderType}/${id}`);
      if (ignore) return;
      setData(response);
      setLoading(false);
    };

    fetchData();
    return () => (ignore = true);
  }, [id]);

  if (loading)
    return (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    );

  return (
    <div>
      <Header
        title={{
          label: data.invoiceId,
        }}
        content={formatMessage({
          id: getTrad('OrderPage.header.subtitle'),
        })}
      />
      <Wrapper>
        <SectionTitle title='customer'>
          <Field title='customerName' value={data.user.username} />
          <Field title='customerEmail' value={data.user.email} />
          <Field title='nif' value={data.user.nif || '-'} />
          <Field
            title='billingAddress'
            value={[
              `${data.billingAddress.firstName} ${data.billingAddress.lastName}`,
              data.billingAddress.address1,
              data.billingAddress.address2 || '',
              `${data.billingAddress.postalCode}, ${data.billingAddress.city}`,
            ].map((v, i) => (
              <span key={i}>
                {i !== 0 && <br />}
                {v}
              </span>
            ))}
            md={12}
            lg={12}
            assert={!!data.billingAddress.firstName}
          />
        </SectionTitle>
        <SectionTitle title='meta'>
          <Field title='createdAt' value={parseDate(data.createdAt)} />
          <Field title='updatedAt' value={parseDate(data.updatedAt)} />
          <Field title='status' value={<StatusBadge noPadding status={data.status} />} />
        </SectionTitle>
        <SectionTitle title='payment'>
          <Field title='price' value={`${data.price.toFixed(2)} €`} />
          <Field
            title='paymentGateway'
            value={<PaymentGatewayBadge gateway={data.paymentGateway} />}
          />
          <Field
            title='mbWayPhone'
            value={data.orderData.mbWayPhone}
            assert={data.paymentGateway === 'MBWAY'}
          />
          <Field
            title='mbReference'
            value={data.orderData.multibanco && data.orderData.multibanco.reference}
            assert={data.paymentGateway === 'MBWAY' || data.paymentGateway === 'MB'}
          />
          <Field title='fee' value={`${data.orderData.fee.toFixed(2)} €`} />
        </SectionTitle>
        <SectionTitle title='shipping'>
          <Field
            title='storePickup'
            value={
              <FormattedMessage
                id={getTrad(`OrderPage.content.field.storePickup.${!!data.storePickup}`)}
              />
            }
          />
          <Field
            title='shippingAddress'
            value={[
              `${data.shippingAddress.firstName} ${data.shippingAddress.firstName}`,
              data.shippingAddress.address1,
              data.shippingAddress.address2 || '',
              `${data.shippingAddress.postalCode}, ${data.shippingAddress.city}`,
            ].map((v, i) => (
              <span key={i}>
                {i !== 0 && <br />}
                {v}
              </span>
            ))}
            md={12}
            lg={6}
            assert={!!data.shippingAddress.firstName}
          />
        </SectionTitle>
        <SectionTitle title='items'>
          {data.orderData.items.map((item) => (
            <Item key={item.slug} item={item} />
          ))}
        </SectionTitle>
      </Wrapper>
    </div>
  );
};

export default OrderInfo;
