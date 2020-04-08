import { Header } from '@buffetjs/custom';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { LoadingIndicator, PopUpWarning, request, useGlobalContext } from 'strapi-helper-plugin';
import getTrad from '../../utils/getTrad';
import PaymentGatewayBadge from '../PaymentGatewayBadge/PaymentGatewayBadge';
import StatusBadge from '../StatusBadge';
import { LoadingWrapper, Wrapper } from './Components';
import Field from './Field';
import Item from './Item';
import SectionTitle from './SectionTitle';

const orderType = 'application::order.order';

const parseDate = (date) => (date ? moment.parseZone(date).utc().format('LLL') : '-');

const OrderInfo = ({ id }) => {
  const { formatMessage } = useGlobalContext();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [nextStepPopup, setNextStepPopup] = useState(false);

  const toggleNextStepPopup = () => setNextStepPopup((v) => !v);

  const fetchData = async () => {
    setLoading(true);
    const response = await request(`/content-manager/explorer/${orderType}/${id}`);
    setData(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading)
    return (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    );

  const needsRestock = data.orderData.items.some((v) => v.needsRestock > 0);

  const handleNextStep = async () => {
    toggleNextStepPopup();
    try {
      await request(
        `/order-management/order/nextstep/${id}?status=${data.status}${
          needsRestock ? `&nextStatus=WAITING_ITEMS` : ''
        }`,
        {
          method: 'POST',
        }
      );

      strapi.notification.success(getTrad(`Action.success.order.nextstep`));

      fetchData();
    } catch (e) {
      console.error(e);
      strapi.notification.error(getTrad(`Action.error.order.nextstep`));
    }
  };

  const headerActions =
    data.status === 'WAITING_PAYMENT' ||
    data.status === 'READY_TO_PICKUP' ||
    data.status === 'PROCESSING' ||
    data.status === 'WAITING_ITEMS'
      ? [
          {
            disabled: data.status === 'WAITING_ITEMS' && needsRestock,
            onClick: () => {
              toggleNextStepPopup();
            },
            color: 'success',
            label: formatMessage({
              id: getTrad(
                `List.content.orders.${
                  data.status === 'WAITING_PAYMENT'
                    ? `markAsPaid`
                    : data.status === 'PROCESSING' && needsRestock
                    ? `markAsWaitingItems`
                    : data.status === 'READY_TO_PICKUP'
                    ? `markAsPickedUp`
                    : data.shippingMethod === 'STORE_PICKUP'
                    ? `markAsReadyToPickup`
                    : `markAsShipped`
                }`
              ),
            }),
            type: 'button',
            style: {
              paddingLeft: 15,
              paddingRight: 15,
              fontWeight: 600,
            },
          },
        ]
      : [];

  return (
    <div>
      <Header
        title={{
          label: data.invoiceId,
        }}
        content={formatMessage({
          id: getTrad('OrderPage.header.subtitle'),
        })}
        actions={headerActions}
      />
      <PopUpWarning
        isOpen={!!nextStepPopup}
        toggleModal={() => toggleNextStepPopup()}
        content={{
          title: getTrad(`PopUpWarning.title`),
          message: getTrad(`PopUpWarning.warning.nextstep`),
          cancel: getTrad(`PopUpWarning.button.cancel`),
          confirm: getTrad(`PopUpWarning.button.confirm`),
        }}
        popUpWarningType='danger'
        onConfirm={handleNextStep}
      />
      <Wrapper>
        <SectionTitle title='customer'>
          <Field title='customerName' value={data.user.username} />
          <Field title='customerEmail' value={data.user.email} />
          <Field title='nif' value={data.nif > 0 ? data.nif : '-'} />
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
          <Field
            title='fee'
            value={`${(data.orderData.fee && data.orderData.fee.toFixed(2)) || '-'} €`}
            assert={data.status !== 'WAITING_PAYMENT'}
          />
        </SectionTitle>
        <SectionTitle title='shipping'>
          <Field
            title='shippingMethod'
            value={
              <FormattedMessage
                id={getTrad(`OrderPage.content.field.shippingMethod.${data.shippingMethod}`)}
              />
            }
            md={3}
            lg={2}
          />
          <Field
            title='shippingCost'
            value={`${(data.shippingCost && data.shippingCost.toFixed(2)) || '-'} €`}
            md={3}
            lg={2}
            assert={data.shippingMethod !== 'STORE_PICKUP'}
          />
          {data.shippingAddress && (
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
              assert={data.shippingMethod !== 'STORE_PICKUP'}
            />
          )}
        </SectionTitle>
        <SectionTitle title='items'>
          {data.orderData.items.map((item) => (
            <Item key={item.slug} item={item} orderId={data.id} setData={setData} />
          ))}
        </SectionTitle>
      </Wrapper>
    </div>
  );
};

export default OrderInfo;
