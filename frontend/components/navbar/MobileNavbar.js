import { AppBar, Fade, IconButton, Toolbar, useScrollTrigger } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import LogoSvg from '~/assets/logo.svg';
import CartIcon from '~/components/cart/CartIcon';
import SearchBar from './SearchBar';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
    color: theme.palette.primary.contrastText,
    transition: theme.transitions.create(['background', 'box-shadow']),
  },
  toolbar: {
    minHeight: process.env.appbar.mobileHeight,
  },
  logo: {
    height: process.env.appbar.mobileHeight - 12,
    fill: theme.palette.primary.contrastText,
  },
  menuButton: {
    // marginRight: theme.spacing(7.5),
    marginRight: theme.spacing(1),
  },
  logoDiv: {
    marginRight: theme.spacing(1),
  },
}));

const MobileNavbar = ({ setDrawerOpen, homePage }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 220,
  });
  const transparentBackground = homePage && !trigger;
  const classes = useStyles();

  const toggleDrawer = () => setDrawerOpen((v) => !v);

  return (
    <AppBar
      position={homePage ? 'fixed' : 'sticky'}
      elevation={transparentBackground ? 0 : 1}
      className={classes.root}
      color={transparentBackground ? 'transparent' : 'primary'}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge='start'
          className={classes.menuButton}
          color='inherit'
          aria-label='menu'
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
        <Fade in={!transparentBackground}>
          <div className={classes.logoDiv}>
            <Link href='/'>
              <a>
                <LogoSvg className={classes.logo} />
              </a>
            </Link>
          </div>
        </Fade>
        <SearchBar />
        <CartIcon />
      </Toolbar>
    </AppBar>
  );
};

MobileNavbar.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  homePage: PropTypes.bool,
};

MobileNavbar.defaultProps = {
  homePage: false,
};

export default MobileNavbar;
