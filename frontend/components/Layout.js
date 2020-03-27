import { Container, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import getConfig from 'next/config';
import Head from 'next/head';
import React from 'react';
import Navbar from './Navbar';

const useStyles = makeStyles((theme) => ({
  colorBackground: {
    zIndex: -1,
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 20%, ${theme.palette.primary.light} 70%)`,
  },
}));

const { publicRuntimeConfig } = getConfig();

const Layout = ({ title, children, hideNavbar = false, colorBackground = false }) => {
  const classes = useStyles();

  return (
    <div>
      <div className={colorBackground ? classes.colorBackground : ''} />
      <Head>
        <title>{`${!!title ? `${title} | ` : ''}${publicRuntimeConfig.siteTitle}`}</title>
      </Head>
      <CssBaseline />
      {!hideNavbar && <Navbar />}
      <Container fixed>{children}</Container>
    </div>
  );
};

export default Layout;
