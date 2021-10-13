/*
 *
 * HomePage
 *
 */
/* eslint-disable */
import React, { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { get, upperFirst } from 'lodash';
import { auth, LoadingIndicatorPage } from 'strapi-helper-plugin';
import PageTitle from '../../components/PageTitle';
import { useModels } from '../../hooks';

import useFetch from './hooks';
import { ALink, Block, Container, LinkWrapper, P, Wave, Separator } from './components';

/* EXTENDED: delete FIRST_BLOCK_LINKS AND SOCIAL_LINKS */

const HomePage = ({ history: { push } }) => {
  // Change to data (preview key)
  const { data } = useFetch();
  // Temporary until we develop the menu API
  const { collectionTypes, singleTypes, isLoading: isLoadingForModels } = useModels();

  // CHANGE: Remove handleClick since it's not longer needed

  const hasAlreadyCreatedContentTypes = useMemo(() => {
    const filterContentTypes = contentTypes => contentTypes.filter(c => c.isDisplayed);

    return (
      filterContentTypes(collectionTypes).length > 1 || filterContentTypes(singleTypes).length > 0
    );
  }, [collectionTypes, singleTypes]);

  if (isLoadingForModels) {
    return <LoadingIndicatorPage />;
  }

  const headerId = hasAlreadyCreatedContentTypes
    ? 'HomePage.greetings'
    : 'app.components.HomePage.welcome';
  const username = get(auth.getUserInfo(), 'firstname', '');
  // CHANGE: Remove link props hasAlreadyCreatedContentTypes
  const linkProps = {
    id: 'app.components.HomePage.button.blog',
    href: 'https://strapi.io/blog/',
    onClick: () => {},
    type: 'blog',
    target: '_blank',
  };

  // CHANGE: Add handleLink
  const handleLink = (link) => (e) => {
    e.preventDefault();
    push(link);
  };

  return (
    <>
      <FormattedMessage id="HomePage.helmet.title">
        {title => <PageTitle title={title} />}
      </FormattedMessage>
      <Container className="container-fluid">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <Block>
              <Wave />
              <FormattedMessage
                id={headerId}
                values={{
                  name: upperFirst(username),
                }}
              >
                {msg => <h2 id="mainHeader">{msg}</h2>}
              </FormattedMessage>
              {hasAlreadyCreatedContentTypes ? (
                <FormattedMessage id="app.components.HomePage.welcomeBlock.content.again">
                  {msg => <P>{msg}</P>}
                </FormattedMessage>
              ) : (
                <FormattedMessage id="HomePage.welcome.congrats">
                  {congrats => {
                    return (
                      <FormattedMessage id="HomePage.welcome.congrats.content">
                        {content => {
                          return (
                            <FormattedMessage id="HomePage.welcome.congrats.content.bold">
                              {boldContent => {
                                return (
                                  <P>
                                    <b>{congrats}</b>&nbsp;
                                    {content}&nbsp;
                                    <b>{boldContent}</b>
                                  </P>
                                );
                              }}
                            </FormattedMessage>
                          );
                        }}
                      </FormattedMessage>
                    );
                  }}
                </FormattedMessage>
              )}
              {/* Remove blog posts */}
              <FormattedMessage id={linkProps.id}>
                {msg => (
                  <ALink
                    rel="noopener noreferrer"
                    {...linkProps}
                    style={{ verticalAlign: ' bottom', marginBottom: 5 }}
                  >
                    {msg}
                  </ALink>
                )}
              </FormattedMessage>
              {/* Remove FIRST_BLOCK_LINKS */}
            </Block>
          </div>

          <div className="col-md-12 col-lg-4">
            <Block style={{ paddingRight: 30, paddingBottom: 0 }}>
              {/* CHANGE: Add custom links */}
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
                    onClick={handleLink('/plugins/order-management/pending')}
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
                    onClick={handleLink('/plugins/metadata-fetcher')}
                    target='_blank'
                  >
                    {msg}
                  </ALink>
                )}
              </FormattedMessage>
              <FormattedMessage id='custom.HomePage.tools.productsNeedingAction'>
                {(msg) => (
                  <ALink
                    rel='noopener noreferrer'
                    href=''
                    onClick={handleLink(
                      '/plugins/content-manager/collectionType/application::product.product?_sort=createdAt:DESC&show=false&page=1&pageSize=50'
                    )}
                    target='_blank'
                  >
                    {msg}
                  </ALink>
                )}
              </FormattedMessage>

              {/* Remove SOCIAL_LINKS */}
            </Block>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);
