import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import getConfig from 'next/config';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import LogoSvg from '~/assets/logo.svg';
import CartIcon from '~/components/cart/CartIcon';
import { useAuth } from '~/hooks/useAuth';
import SearchBar from './SearchBar';

const { publicRuntimeConfig } = getConfig();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: {
    height: publicRuntimeConfig.appbar.desktopHeight,
  },
  logo: {
    height: publicRuntimeConfig.appbar.desktopHeight - 12,
    fill: theme.palette.primary.contrastText,
    verticalAlign: 'middle',
    marginRight: theme.spacing(5),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
}));

const DesktopNavbar = ({ hideSearchBar = false }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { username, logout } = useAuth();
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position='sticky' className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Link href='/'>
          <a>
            <LogoSvg className={classes.logo} />
          </a>
        </Link>
        {!hideSearchBar && <SearchBar />}
        <div className={classes.grow} />
        {username ? (
          <div>
            <IconButton
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleMenu}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <Typography variant='h6' component='p'>{`Bem vindo(a), ${username}`}</Typography>
              <Link href='/dashboard'>
                <MenuItem>Minha conta</MenuItem>
              </Link>
              <MenuItem onClick={logout}>Sair</MenuItem>
            </Menu>
          </div>
        ) : (
          <div>
            <Link href='/signin'>
              <Button color='inherit'>Iniciar sessão</Button>
            </Link>
            <Link href='/signup'>
              <Button color='inherit'>Registar</Button>
            </Link>
          </div>
        )}
        <CartIcon />
      </Toolbar>
    </AppBar>
  );
};

DesktopNavbar.propTypes = {
  hideSearchBar: PropTypes.bool,
};

DesktopNavbar.defaultProps = {
  hideSearchBar: false,
};

export default DesktopNavbar;
