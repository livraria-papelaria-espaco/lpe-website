/*
 *
 * HomePage
 *
 */
/* eslint-disable */
import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { get, upperFirst } from 'lodash';
import { auth } from 'strapi-helper-plugin';
import PageTitle from '../../components/PageTitle';

import useFetch from './previewHooks';
import { ALink, Block, Container, LinkWrapper, P, Wave, Separator } from './components';

const HomePage = ({ global: { plugins }, history: { push } }) => {
  const { data } = useFetch();
  const username = get(auth.getUserInfo(), 'username', '');
  const linkProps = {
    id: 'app.components.HomePage.button.blog',
    href: 'https://blog.strapi.io/',
    onClick: () => {},
    type: 'blog',
    target: '_blank',
  };

  const handleOrderManagementClick = (e) => {
    e.preventDefault();
    push('/plugins/order-management/pending');
  };

  const handleMetadataFetcherClick = (e) => {
    e.preventDefault();
    push('/plugins/metadata-fetcher');
  };

  return (
    <>
      <FormattedMessage id='HomePage.helmet.title'>
        {(title) => <PageTitle title={title} />}
      </FormattedMessage>
      <Container className='container-fluid'>
        <div className='row'>
          <div className='col-lg-8 col-md-12'>
            <Block>
              <Wave />
              <FormattedMessage
                id='HomePage.greetings'
                values={{
                  name: upperFirst(username),
                }}
              >
                {(msg) => <h2 id='mainHeader'>{msg}</h2>}
              </FormattedMessage>
              <FormattedMessage id='app.components.HomePage.welcomeBlock.content.again'>
                {(msg) => <P>{msg}</P>}
              </FormattedMessage>
              <FormattedMessage id={linkProps.id}>
                {(msg) => (
                  <ALink
                    rel='noopener noreferrer'
                    {...linkProps}
                    style={{ verticalAlign: ' bottom', marginBottom: 5 }}
                  >
                    {msg}
                  </ALink>
                )}
              </FormattedMessage>
            </Block>
          </div>

          <div className='col-md-12 col-lg-4'>
            <Block style={{ paddingRight: 30, paddingBottom: 0 }}>
              <FormattedMessage id='custom.HomePage.tools.title'>
                {(msg) => <h2>{msg}</h2>}
              </FormattedMessage>
              <FormattedMessage id='custom.HomePage.tools.content'>
                {(content) => <P style={{ marginTop: 7, marginBottom: 0 }}>{content}</P>}
              </FormattedMessage>
              <FormattedMessage id='custom.HomePage.tools.previewMode'>
                {(msg) => (
                  <ALink rel='noopener noreferrer' href={data || ''} target='_blank'>
                    {msg}
                  </ALink>
                )}
              </FormattedMessage>
              <FormattedMessage id='Order Management'>
                {(msg) => (
                  <ALink
                    rel='noopener noreferrer'
                    href=''
                    onClick={handleOrderManagementClick}
                    target='_blank'
                  >
                    {msg}
                  </ALink>
                )}
              </FormattedMessage>
              <FormattedMessage id='Metadata Fetcher'>
                {(msg) => (
                  <ALink
                    rel='noopener noreferrer'
                    href=''
                    onClick={handleMetadataFetcherClick}
                    target='_blank'
                  >
                    {msg}
                  </ALink>
                )}
              </FormattedMessage>
            </Block>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);
