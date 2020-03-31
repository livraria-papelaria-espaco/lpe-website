import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountIcon from '@material-ui/icons/PersonRounded';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import LogoSvg from '~/assets/logo.svg';
import CartIcon from '~/components/cart/CartIcon';
import Emoji from '~/components/utils/Emoji';
import { useAuth } from '~/hooks/useAuth';
import SearchBar from './SearchBar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
    marginBottom: theme.spacing(4),
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: {
    height: process.env.appbar.desktopHeight,
  },
  logo: {
    height: process.env.appbar.desktopHeight - 12,
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
  menuContent: {
    padding: theme.spacing(1),
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
              <AccountIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
              classes={{ paper: classes.menuContent }}
            >
              <Typography variant='h6' component='p'>
                {`Olá, ${username} `}
                <Emoji symbol='👋' />
              </Typography>
              <Link href='/dashboard'>
                <MenuItem>Minha conta</MenuItem>
              </Link>
              <MenuItem onClick={logout}>Sair</MenuItem>
            </Menu>
          </div>
        ) : (
          <div>
            <Link href='/auth/signin'>
              <Button color='inherit'>Iniciar sessão</Button>
            </Link>
            <Link href='/auth/signup'>
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
