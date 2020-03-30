const paymentGatewayMap = {
  IN_STORE: 'Pagar em loja',
  MB: 'Multibanco',
  MBWAY: 'MBWay',
};

const orderStatusMap = {
  WAITING_PAYMENT: 'A aguardar pagamento',
  PROCESSING: 'Em processamento',
  SHIPPED: 'Enviada',
  DELIVERED: 'Entregue',
  READY_TO_PICKUP: 'Pronta para recolha',
  DELIVERED_FAILED: 'Falha na entrega',
  CANCELLED: 'Cancelada',
  WAITING_ITEMS: 'À espera de produtos',
};

const orderStatusDescriptionMap = {
  WAITING_PAYMENT: 'Estamos a aguardar o pagamento da encomenda para prosseguirmos com a mesma',
  PROCESSING: 'A sua encomenda será processada por um dos nossos colaboradores',
  SHIPPED: 'A sua encomenda já saiu da nossa loja',
  DELIVERED: 'A sua encomenda foi entregue',
  READY_TO_PICKUP: 'A sua encomenda está pronta para ser recolhida na nossa loja',
  DELIVERED_FAILED: 'Os serviços de correio tiveram dificuldades em entregar a sua encomenda',
  CANCELLED: 'A sua encomenda foi cancelada',
  WAITING_ITEMS: 'Alguns dos produtos não estavam em stock na nossa loja, mas já veem a caminho',
};

const shippingMethodMap = {
  STORE_PICKUP: 'Recolha em loja',
  CTT: 'Envio por CTT',
};

export { paymentGatewayMap, orderStatusMap, orderStatusDescriptionMap, shippingMethodMap };
