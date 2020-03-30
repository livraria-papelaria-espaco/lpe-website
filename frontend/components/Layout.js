import { Container, CssBaseline, NoSsr } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import getConfig from 'next/config';
import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';
import CookieBanner from 'react-cookie-banner';
import CookieAlert from './CookieAlert';
import Footer from './Footer';
import Navbar from './navbar/Navbar';

const { publicRuntimeConfig } = getConfig();

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  colorBackground: {
    zIndex: -1,
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 20%, ${theme.palette.primary.light} 70%)`,
  },
  content: {
    flex: '1 0 auto',
  },
  drawerPadding: {
    marginLeft: publicRuntimeConfig.appbar.drawerWidth,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  shrink: {
    flexShrink: 0,
  },
}));

const Layout = ({ title, children, hideNavbar, hideFooter, showStoreNav, colorBackground }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NoSsr>
        <CookieBanner>{(onAccept) => <CookieAlert onAccept={onAccept} />}</CookieBanner>
      </NoSsr>
      <div className={colorBackground ? classes.colorBackground : ''} />
      <Head>
        <title>{`${title ? `${title} | ` : ''}${publicRuntimeConfig.siteTitle}`}</title>
      </Head>
      <CssBaseline />
      {!hideNavbar && <Navbar hideStoreNav={!showStoreNav} />}
      <div
        className={`${classes.content} ${!showStoreNav || hideNavbar ? '' : classes.drawerPadding}`}
      >
        <Container fixed className={classes.body}>
          {children}
        </Container>
      </div>
      <div
        className={`${classes.shrink} ${!showStoreNav || hideNavbar ? '' : classes.drawerPadding}`}
      >
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
};

Layout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  hideNavbar: PropTypes.bool,
  hideFooter: PropTypes.bool,
  showStoreNav: PropTypes.bool,
  colorBackground: PropTypes.bool,
};

Layout.defaultProps = {
  title: '',
  hideNavbar: false,
  hideFooter: false,
  showStoreNav: false,
  colorBackground: false,
};

export default Layout;
