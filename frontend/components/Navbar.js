import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { unsetToken } from '../lib/auth';
import Link from 'next/link';
import CartIcon from './cart/CartIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    cursor: 'pointer',
  },
  grow: {
    flexGrow: 1,
  },
}));

const Navbar = ({ username }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position='static' className={classes.root}>
      <Toolbar>
        <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
          <MenuIcon />
        </IconButton>
        <Link href='/'>
          <Typography variant='h6' className={classes.title} component='a'>
            Livraria e Papelaria Espaço
          </Typography>
        </Link>
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
              <MenuItem onClick={unsetToken}>Sair</MenuItem>
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

export default Navbar;
