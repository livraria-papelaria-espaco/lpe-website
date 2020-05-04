import { Container, CssBaseline, NoSsr } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';
import CookieBanner from 'react-cookie-banner';
import CookieAlert from './CookieAlert';
import Footer from './Footer';
import Navbar from './navbar/Navbar';
import BackgroundImg from '~/assets/background.jpg';

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
    // background: `linear-gradient(45deg, ${theme.palette.primary.dark} 20%, ${theme.palette.primary.light} 70%)`,
    background: `url(${BackgroundImg}) center right no-repeat fixed padding-box content-box`,
  },
  content: {
    flex: '1 0 auto',
    marginBottom: (props) => (props.noContainer || props.hideFooter ? 0 : theme.spacing(10)),
  },
  shrink: {
    flexShrink: 0,
  },
}));

const Layout = ({
  title,
  children,
  hideNavbar,
  hideFooter,
  homePageNavbar,
  showStoreNav,
  colorBackground,
  noContainer,
}) => {
  const classes = useStyles({ noContainer, hideFooter });

  return (
    <div className={classes.root}>
      <NoSsr>
        <CookieBanner dismissOnScrollThreshold={1000}>
          {(onAccept) => <CookieAlert onAccept={onAccept} />}
        </CookieBanner>
      </NoSsr>
      <div className={colorBackground ? classes.colorBackground : ''} />
      <Head>
        <title>{`${title ? `${title} | ` : ''}${process.env.siteTitle}`}</title>
        <meta
          property='og:title'
          content={`${title ? `${title} | ` : ''}${process.env.siteTitle}`}
        />
      </Head>
      <CssBaseline />
      {!hideNavbar && <Navbar hideStoreNav={!showStoreNav} homePage={homePageNavbar} />}
      <div className={classes.content}>
        {noContainer ? children : <Container fixed>{children}</Container>}
      </div>
      <div className={classes.shrink}>{!hideFooter && <Footer />}</div>
    </div>
  );
};

Layout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  hideNavbar: PropTypes.bool,
  hideFooter: PropTypes.bool,
  homePageNavbar: PropTypes.bool,
  showStoreNav: PropTypes.bool,
  colorBackground: PropTypes.bool,
  noContainer: PropTypes.bool,
};

Layout.defaultProps = {
  title: '',
  hideNavbar: false,
  hideFooter: false,
  homePageNavbar: false,
  showStoreNav: false,
  colorBackground: false,
  noContainer: false,
};

export default Layout;
