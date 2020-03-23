/*
 *
 * HomePage
 *
 */

import { Header } from '@buffetjs/custom';
import React, { memo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HeaderNav, useGlobalContext } from 'strapi-helper-plugin';
import ListDataHandler from '../../components/ListDataHandler';
import pluginId from '../../pluginId';
import getTrad from '../../utils/getTrad';
import Search from './Search';
import Wrapper from './Wrapper';

const HomePage = () => {
  const { formatMessage } = useGlobalContext();
  const { view } = useParams();
  const [search, setSearch] = useState('');

  const headerNavLinks = [
    {
      name: getTrad('HeaderNav.link.pending'),
      to: `/plugins/${pluginId}/pending`,
    },
    {
      name: getTrad('HeaderNav.link.waitingItems'),
      to: `/plugins/${pluginId}/waitingItems`,
    },
    {
      name: getTrad('HeaderNav.link.readyToPickup'),
      to: `/plugins/${pluginId}/pickup`,
    },
    {
      name: getTrad('HeaderNav.link.other'),
      to: `/plugins/${pluginId}/other`,
    },
  ];

  const content =
    ['pending', 'waitingItems', 'pickup', 'other'].indexOf(view) >= 0 ? (
      <ListDataHandler type={view} search={search} />
    ) : (
      <p>Invalid path</p>
    );

  return (
    <Wrapper className='container-fluid'>
      <Header
        title={{
          label: formatMessage({
            id: getTrad('HomePage.header.title'),
          }),
        }}
        content={formatMessage({
          id: getTrad('HomePage.header.description'),
        })}
        actions={[
          {
            Component: Search,
            key: 'input-search',
            setSearch,
          },
        ]}
      />
      <HeaderNav links={headerNavLinks} style={{ marginTop: '4.6rem' }} />
      {content}
    </Wrapper>
  );
};

export default memo(HomePage);
