'use strict';

const sendOrderCreatedEmail = (data) =>
  sendOrderEmail(
    data,
    `Encomenda #${data.order.invoiceId} criada com sucesso`,
    'A sua encomenda foi criada com sucesso. Aceda à area cliente no nosso site para a seguir.',
    generateOrderCreatedHtml
  );

const sendOrderPaidEmail = (data) =>
  sendOrderEmail(
    data,
    `Confirmação do pagamento da sua encomenda #${data.order.invoiceId}`,
    'Recebemos o pagamento da sua encomenda. Aceda à area cliente no nosso site para a seguir.',
    generateOrderPaidHtml
  );

const sendOrderReadyToPickupEmail = (data) =>
  sendOrderEmail(
    data,
    `A sua encomenda #${data.order.invoiceId} está pronta para ser recolhida`,
    'A sua encomenda está pronta para ser recolhida na nossa loja.',
    generateOrderReadToPickupHtml
  );

const sendOrderShippedEmail = (data) =>
  sendOrderEmail(
    data,
    `A sua encomenda #${data.order.invoiceId} foi enviada`,
    'A sua encomenda foi enviada.',
    generateOrderShippedHtml
  );

module.exports = {
  sendOrderCreatedEmail,
  sendOrderPaidEmail,
  sendOrderReadyToPickupEmail,
  sendOrderShippedEmail,
};

const sendOrderEmail = async ({ order, user }, subject, text, htmlGenerator) => {
  await strapi.plugins['email'].services.email.send({
    to: user.email,
    subject,
    text,
    html: generateHtmlStructure(
      htmlGenerator({
        orderId: order.invoiceId,
        date: order.createdAt.toLocaleString('pt-PT'),
        name: user.username,
        baseUrl: strapi.config.currentEnvironment.frontendUrl || 'http://localhost:3000',
        shippingMethod: order.shippingMethod,
        shippingAddress: order.shippingAddress,
        paymentDetails: {
          gateway: order.paymentGateway,
          multibanco: order.orderData.multibanco,
          mbWayPhone: order.orderData.mbWayPhone,
          paid: order.status !== 'WAITING_PAYMENT',
        },
        items: order.orderData.items,
        price: order.price,
      })
    ).toString(),
  });
};

const generateHtmlStructure = (content) =>
  `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
      />
    </head>
    <body>
      ${content}
    </body>
  </html>`;

const generateOrderCreatedHtml = ({
  orderId,
  date,
  name,
  baseUrl,
  shippingMethod,
  shippingAddress,
  paymentDetails,
  items,
  price,
}) =>
  `<h1>Encomenda #${orderId} efetuada com sucesso</h1>
  <h4>${date}</h4>
  <div>
    Estimado(a) ${name},<br />
    Obrigado pela sua encomenda através da loja online Livraria e Papelaria
    Espaço. Poderá seguir a sua encomenda através da
    <a href="${baseUrl}/dashboard/orders">área cliente no nosso site</a>.
    ${
      shippingMethod === 'STORE_PICKUP'
        ? `Receberá um email quando a sua encomenda estiver pronta
    para recolha na nossa loja.`
        : `Receberá um email quando a sua encomenda
    foi enviada.`
    }
  </div>
  <h2>Modo de entrega</h2>
  <div>
    ${generateDeliveryInfo(shippingMethod, shippingAddress)}
  </div>
  <h2>Detalhes de pagamento</h2>
  <div>
    ${generatePaymentInfo(paymentDetails)}
  </div>
  <h2>Resumo da encomenda</h2>
  <div>
    ${generateProductDetails(baseUrl, items)}
  </div>
  <div>
    <hr />
    <p><strong>Total:</strong> ${price}
  </div>`;

const generateOrderPaidHtml = ({
  orderId,
  name,
  baseUrl,
  shippingMethod,
  shippingAddress,
  paymentDetails,
  items,
  price,
}) =>
  `<h1>Confirmação do pagamento para a encomenda #${orderId}</h1>
  <div>
    Estimado(a) ${name},<br />
    Este email confirma o pagamento da sua encomenda. Para mais informações,
    aceda à 
    <a href="${baseUrl}/dashboard/orders">área cliente no nosso site</a>.
    ${
      shippingMethod === 'STORE_PICKUP'
        ? `Receberá um email quando a sua encomenda estiver pronta
    para recolha na nossa loja.`
        : `Receberá um email quando a sua encomenda
    foi enviada.`
    }
  </div>
  <h2>Modo de entrega</h2>
  <div>
    ${generateDeliveryInfo(shippingMethod, shippingAddress)}
  </div>
  <h2>Detalhes de pagamento</h2>
  <div>
    ${generatePaymentInfo(paymentDetails)}
  </div>
  <h2>Resumo da encomenda</h2>
  <div>
    ${generateProductDetails(baseUrl, items)}
  </div>
  <div>
    <hr />
    <p><strong>Total:</strong> ${price}
  </div>`;

const generateOrderReadToPickupHtml = ({ orderId, name, baseUrl, items, price }) =>
  `<h1>A sua encomenda #${orderId} está pronta para ser recolhida!</h1>
  <div>
    Estimado(a) ${name},<br />
    A sua encomenda está pronta para ser recolhida na nossa loja.
    // TODO documentos a levar, etc
  </div>
  <h2>Resumo da encomenda</h2>
  <div>
    ${generateProductDetails(baseUrl, items)}
  </div>
  <div>
    <hr />
    <p><strong>Total:</strong> ${price}
  </div>`;

const generateOrderShippedHtml = ({
  orderId,
  name,
  baseUrl,
  shippingMethod,
  shippingAddress,
  items,
  price,
}) =>
  `<h1>A sua encomenda #${orderId} foi enviada!</h1>
  <div>
    Estimado(a) ${name},<br />
    A sua encomenda foi enviada.
    // TODO tracking number, previsão de chegada, etc
  </div>
  <h2>Modo de entrega</h2>
  <div>
    ${generateDeliveryInfo(shippingMethod, shippingAddress)}
  </div>
  <h2>Resumo da encomenda</h2>
  <div>
    ${generateProductDetails(baseUrl, items)}
  </div>
  <div>
    <hr />
    <p><strong>Total:</strong> ${price}
  </div>`;

const generateDeliveryInfo = (shippingMethod, shippingAddress) => {
  if (shippingMethod === 'STORE_PICKUP')
    return `<p>
        Para recolher em loja.
        <br/>
        //TODO inserir morada da loja aqui
      </p>`;
  return `<p>A sua encomenda será enviada para a seguinte morada:</p>
    <p>
      ${shippingAddress.firstName} ${shippingAddress.lastName}
      <br/>
      ${shippingAddress.address1}
      <br/>
      ${shippingAddress.address2}
      <br/>
      ${shippingAddress.postalCode}, ${shippingAddress.city}
    </p>`;
};

const generatePaymentInfo = (paymentDetails) => {
  try {
    if (paymentDetails.gateway === 'IN_STORE')
      return `<p>O pagamento será efetuado na loja, no momento de recolha.</p>`;
    if (paymentDetails.gateway === 'MB')
      return `<p>
      ${paymentDetails.paid ? `` : `<strong>Aguardamos o pagamento da encomenda</strong><br/>`}
      <strong>Meio de pagamento: </strong> Referência Multibanco
      <br/>
      <strong>Entidade: </strong> ${paymentDetails.multibanco.entity}
      <br/>
      <strong>Referência: </strong> ${paymentDetails.multibanco.reference}
      <br/>
      <strong>Valor: </strong> ${paymentDetails.multibanco.price.toFixed(2)}€
      <br/>
      // TODO validade
    </p>`;
    if (paymentDetails.gateway === 'MBWAY')
      return `<p>
      ${paymentDetails.paid ? `` : `<strong>Aguardamos o pagamento da encomenda</strong><br/>`}
      <strong>Meio de pagamento: </strong> MBWay
      <br />
      <strong>Telemóvel: </strong> ${paymentDetails.mbWayPhone}
      <br />
      <strong>Valor: </strong> ${paymentDetails.multibanco.price}
    </p>`;
  } catch {}
  return `<p>Ocorreu um erro. Por favor contacte-nos.</p>`;
};

const generateProductDetails = (baseUrl, items) => {
  return items
    .map(
      (item) =>
        `<div>
          <p><a href="${baseUrl}/product/${item.slug}">${item.name}</a></p>
          <p><strong>Preço unitário:</strong> ${item.priceUnity} x${item.quantity}</p>
          <p><strong>Preço total:</strong> ${item.price}</p>
        </div>`
    )
    .join('');
};
