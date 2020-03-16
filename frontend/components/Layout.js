import { Container, CssBaseline } from '@material-ui/core';
import getConfig from 'next/config';
import Head from 'next/head';
import React from 'react';

const { publicRuntimeConfig } = getConfig();

const Layout = ({ title, children }) => (
  <div>
    <Head>
      <title>{`${title} | ${publicRuntimeConfig.siteTitle}`}</title>
    </Head>
    <CssBaseline />
    <Container fixed>{children}</Container>
  </div>
);

export default Layout;
