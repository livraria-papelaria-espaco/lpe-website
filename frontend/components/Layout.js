import { Container, CssBaseline } from '@material-ui/core';
import getConfig from 'next/config';
import Head from 'next/head';
import React from 'react';
import Navbar from './Navbar';

const { publicRuntimeConfig } = getConfig();

const Layout = ({ title, children, hideNavbar = false }) => (
  <div>
    <Head>
      <title>{`${title} | ${publicRuntimeConfig.siteTitle}`}</title>
    </Head>
    <CssBaseline />
    {!hideNavbar && <Navbar />}
    <Container fixed>{children}</Container>
  </div>
);

export default Layout;
