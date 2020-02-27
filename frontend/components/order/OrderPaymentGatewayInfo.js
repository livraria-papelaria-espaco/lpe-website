import React from 'react';

const OrderPaymentGatewayInfo = ({ gateway, orderData }) => {
  let info = null;

  if (gateway === 'IN_STORE') {
    info = <p>A pagar na loja</p>;
  } else if (gateway === 'MB') {
    info = (
      <p>
        {`Entidade: ${orderData.multibanco.entity}`} <br />
        {`Referência: ${orderData.multibanco.reference}`} <br />
        {`Valor: ${orderData.multibanco.price.toFixed(2)}`}
        <br />A referência tem a validade de 24h. Após as 24h, deixa de ser possivel efetuar o
        pagamento.
      </p>
    );
  } else if (gateway === 'MBWAY') {
    info = (
      <p>
        Recebeu uma notificação na conta MBWAY de {orderData.mbWayPhone}. O prazo para efetuar o
        pagamento é de 15 minutos.
      </p>
    );
  }

  return (
    <div>
      <h3>Informação pagamento</h3>
      {info}
    </div>
  );
};

export default OrderPaymentGatewayInfo;
