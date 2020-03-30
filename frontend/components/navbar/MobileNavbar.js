import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import getConfig from 'next/config';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import LogoSvg from '~/assets/logo.svg';
import CartIcon from '~/components/cart/CartIcon';

const { publicRuntimeConfig } = getConfig();

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
  toolbar: {
    minHeight: publicRuntimeConfig.appbar.mobileHeight,
  },
  logo: {
    height: publicRuntimeConfig.appbar.mobileHeight - 12,
    fill: theme.palette.primary.contrastText,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
    textAlign: 'center',
  },
}));

const MobileNavbar = ({ setDrawerOpen }) => {
  const classes = useStyles();

  const toggleDrawer = () => setDrawerOpen((v) => !v);

  return (
    <AppBar position='sticky' className={classes.root}>
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
        <div className={classes.grow}>
          <Link href='/'>
            <a>
              <LogoSvg className={classes.logo} />
            </a>
          </Link>
        </div>
        <CartIcon />
      </Toolbar>
    </AppBar>
  );
};

MobileNavbar.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
};

export default MobileNavbar;
