/*
 *
 * HomePage
 *
 */

import { Header } from '@buffetjs/custom';
import React, { memo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Button, request, useGlobalContext } from 'strapi-helper-plugin';
import pluginId from '../../pluginId';
import getTrad from '../../utils/getTrad';
import { OuterWrapper, StlyedInputCheckbox, StyledInputText, Wrapper } from './Components';

const HomePage = () => {
  const { formatMessage } = useGlobalContext();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [isbn, setIsbn] = useState('');
  const [forceImages, setForceImages] = useState(false);

  const handleIsbnChange = (e) => setIsbn(e.target.value);
  const handleForceImagesChange = (e) => setForceImages(e.target.value);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const response = await request(
        `/metadata-fetcher/fetchBook?isbn=${isbn}&forceImages=${forceImages}`
      );
      strapi.notification.success(getTrad(`Action.success.book`));
      history.push({
        pathname: `/plugins/content-manager/collectionType/application::product.product/${response.id}`,
        search: `?redirectUrl=${`/plugins/${pluginId}/`}`,
      });
    } catch (e) {
      console.error(e);
      strapi.notification.error(getTrad(`Action.error.book`));
    }
    setLoading(false);
  };

  return (
    <OuterWrapper className='container-fluid'>
      <Header
        title={{
          label: formatMessage({
            id: getTrad('HomePage.header.title'),
          }),
        }}
        content={formatMessage({
          id: getTrad('HomePage.header.description'),
        })}
      />
      <Wrapper>
        <h3>
          <FormattedMessage id={getTrad(`HomePage.title.book`)} />
        </h3>
        <p>
          <FormattedMessage id={getTrad(`HomePage.warning.overwrite`)} />
        </p>
        <StyledInputText
          name='ISBN'
          placeholder='9780000000000'
          value={isbn}
          onChange={handleIsbnChange}
        />
        <StlyedInputCheckbox
          name='forceImages'
          value={forceImages}
          onChange={handleForceImagesChange}
          label={{ id: getTrad(`HomePage.input.books.forceImages`) }}
        />
        <Button
          primary
          label={getTrad(`HomePage.button.execute`)}
          loader={loading}
          onClick={handleButtonClick}
        />
      </Wrapper>
    </OuterWrapper>
  );
};

export default memo(HomePage);
