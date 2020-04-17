import {
  AppBar,
  Button,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
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
    color: theme.palette.primary.contrastText,
    transition: theme.transitions.create(['background', 'box-shadow']),
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
    marginLeft: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  menuContent: {
    padding: theme.spacing(1),
  },
}));

const DesktopNavbar = ({ hideSearchBar, homePage, setDrawerOpen }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 220,
  });
  const transparentBackground = homePage && !trigger;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { username, logout } = useAuth();
  const open = Boolean(anchorEl);

  const toggleDrawer = () => setDrawerOpen((v) => !v);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position={homePage ? 'fixed' : 'sticky'}
      className={classes.root}
      elevation={transparentBackground ? 0 : 1}
      color={transparentBackground ? 'transparent' : 'primary'}
    >
      <Toolbar className={classes.toolbar}>
        <Fade in={!transparentBackground}>
          <div>
            <Link href='/'>
              <a>
                <LogoSvg className={classes.logo} />
              </a>
            </Link>
          </div>
        </Fade>
        <div className={classes.grow} />
        {!hideSearchBar && <SearchBar />}
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
        <IconButton
          edge='start'
          className={classes.menuButton}
          color='inherit'
          aria-label='menu'
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

DesktopNavbar.propTypes = {
  hideSearchBar: PropTypes.bool,
  homePage: PropTypes.bool,
  setDrawerOpen: PropTypes.func.isRequired,
};

DesktopNavbar.defaultProps = {
  hideSearchBar: false,
  homePage: false,
};

export default DesktopNavbar;
