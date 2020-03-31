import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const OrderPaymentGatewayInfo = ({ gateway, orderData, expiresAt }) => {
  let info = null;

  const date = new Date(expiresAt);

  if (gateway === 'IN_STORE') {
    info = <p>A pagar na loja</p>;
  } else if (gateway === 'MB') {
    info = (
      <Typography>
        {`Entidade: ${orderData.multibanco.entity}`} <br />
        {`Referência: ${orderData.multibanco.reference}`} <br />
        {`Valor: ${orderData.multibanco.price.toFixed(2)} €`}
        <br />A validade da referência termina a <strong>{date.toLocaleString('pt-PT')}</strong>.
        Após a validade expirar, deixa de ser possivel efetuar o pagamento e a encomenda será
        cancelada.
      </Typography>
    );
  } else if (gateway === 'MBWAY') {
    info = (
      <Typography>
        Recebeu uma notificação na conta MBWAY de <strong>{orderData.mbWayPhone}</strong>. O prazo
        para efetuar o pagamento é de <strong>10 minutos</strong> (até{' '}
        {date.toLocaleString('pt-PT')}). Após a validade expirar, deixa de ser possivel efetuar o
        pagamento e a encomenda será cancelada.
      </Typography>
    );
  }

  return (
    <>
      <Typography>
        <strong>Informação de pagamento</strong>
      </Typography>
      {info}
    </>
  );
};

OrderPaymentGatewayInfo.propTypes = {
  gateway: PropTypes.oneOf(['IN_STORE', 'MB', 'MBWAY']).isRequired,
  orderData: PropTypes.shape({
    multibanco: PropTypes.shape({
      entity: PropTypes.string,
      reference: PropTypes.string,
      price: PropTypes.number,
    }),
    mbWayPhone: PropTypes.string,
  }),
  expiresAt: PropTypes.string,
};

OrderPaymentGatewayInfo.defaultProps = {
  orderData: {},
  expiresAt: '0',
};

export default OrderPaymentGatewayInfo;
