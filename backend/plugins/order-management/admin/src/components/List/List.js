import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { LoadingBar, LoadingIndicator } from 'strapi-helper-plugin';
import getTrad from '../../utils/getTrad';
import { Flex, ListEmpty, ListWrapper, Title, Wrapper } from './Components';
import Row from './Row';

const List = ({ data, setPage, page, count, loading }) => {
  const { pathname, search } = useLocation();
  const { push } = useHistory();

  const redirectUrl = `redirectUrl=${pathname}${search}`;

  const handleGoTo = (id) => {
    push({
      pathname: `${pathname}/${id}`,
      search: redirectUrl,
    });
  };

  return (
    <Wrapper>
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
              data.map((value) => <Row key={value.id} item={value} handleGoTo={handleGoTo} />)
            )}
          </ul>
        )}
      </ListWrapper>
    </Wrapper>
  );
};

export default memo(List);
