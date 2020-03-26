import { Container, CssBaseline } from '@material-ui/core';
import getConfig from 'next/config';
import Head from 'next/head';
import React from 'react';
import Navbar from './Navbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  colorBackground: {
    height: '100vh',
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 20%, ${theme.palette.primary.light} 70%)`,
  },
}));

const { publicRuntimeConfig } = getConfig();

const Layout = ({ title, children, hideNavbar = false, colorBackground = false }) => {
  const classes = useStyles();

  return (
    <div className={colorBackground ? classes.colorBackground : ''}>
      <Head>
        <title>{`${title} | ${publicRuntimeConfig.siteTitle}`}</title>
      </Head>
      <CssBaseline />
      {!hideNavbar && <Navbar />}
      <Container fixed>{children}</Container>
    </div>
  );
};

export default Layout;
