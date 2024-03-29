import React, { memo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { LoadingBar, LoadingIndicator, PopUpWarning, request } from 'strapi-helper-plugin';
import getTrad from '../../utils/getTrad';
import { Flex, ListEmpty, ListWrapper, Title, Wrapper } from './Components';
import Row from './Row';

const List = ({ data, count, loading, refetch }) => {
  const { pathname, search } = useLocation();
  const { push } = useHistory();
  const [nextStepPopup, setNextStepPopup] = useState(false);

  const handleNextStep = async () => {
    setNextStepPopup(false);
    try {
      await request(
        `/order-management/order/nextstep/${nextStepPopup.id}?status=${nextStepPopup.status}`,
        {
          method: 'POST',
        }
      );

      strapi.notification.toggle({
        message: {
          id: getTrad(`Action.success.order.nextstep`),
          defaultMessage: 'Order status updated successfuly.',
        },
      });

      refetch();
    } catch (e) {
      console.error(e);
      strapi.notification.toggle({
        type: 'warning',
        message: {
          id: getTrad(`Action.error.order.nextstep`),
          defaultMessage: 'Erro ao alterar estado da encomenda.',
        },
      });
    }
  };

  const redirectUrl = `redirectUrl=${pathname}${search}`;

  const handleGoTo = (id) => {
    push({
      pathname: `${pathname.split('/').slice(0, -1).join('/')}/view/${id}`,
      search: redirectUrl,
    });
  };

  return (
    <Wrapper>
      <PopUpWarning
        isOpen={!!nextStepPopup}
        toggleModal={() => setNextStepPopup(false)}
        content={{
          title: getTrad(`PopUpWarning.title`),
          message: getTrad(`PopUpWarning.warning.nextstep`),
          cancel: getTrad(`PopUpWarning.button.cancel`),
          confirm: getTrad(`PopUpWarning.button.confirm`),
        }}
        popUpWarningType='danger'
        onConfirm={handleNextStep}
      />

      <Flex>
        <Title>
          {loading ? (
            <LoadingBar style={{ marginTop: '0' }} />
          ) : (
            <FormattedMessage
              id={getTrad(`List.title.orders.${count !== 1 ? 'plural' : 'singular'}`)}
              values={{ count }}
            />
          )}
        </Title>
      </Flex>

      <ListWrapper className={`${loading ? 'loading-container' : ''}`}>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <ul className='padded-list'>
            {data.length === 0 ? (
              <ListEmpty>
                <div>
                  <FormattedMessage id={getTrad(`List.content.orders.empty`)} />
                </div>
              </ListEmpty>
            ) : (
              data.map((value) => (
                <Row
                  key={value.id}
                  item={value}
                  handleGoTo={handleGoTo}
                  openNextStepWarning={setNextStepPopup}
                />
              ))
            )}
          </ul>
        )}
      </ListWrapper>
    </Wrapper>
  );
};

export default memo(List);
