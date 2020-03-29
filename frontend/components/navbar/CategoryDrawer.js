import { Divider, Drawer, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import getConfig from 'next/config';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import Emoji from '~/components/utils/Emoji';
import { useAuth } from '~/hooks/useAuth';
import CategoryList from '../categories/CategoryList';

const { publicRuntimeConfig } = getConfig();

const { drawerWidth } = publicRuntimeConfig.appbar;

const useStyles = makeStyles((theme) => ({
  drawer: {
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar
  toolbar: {
    height: publicRuntimeConfig.appbar.desktopHeight,
    [theme.breakpoints.down('sm')]: {
      height: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(2)}px`,
  },
  grow: {
    flexGrow: 1,
  },
  categoryList: {
    overflow: 'auto',
  },
}));

const CategoryDrawer = ({ mobile = false, mobileOpen = false, setOpen }) => {
  const classes = useStyles();
  const { username, logout } = useAuth();

  const handleClose = () => setOpen(false);

  return (
    <nav className={classes.drawer}>
      <Drawer
        variant={mobile ? 'temporary' : 'permanent'}
        classes={{
          paper: classes.drawerPaper,
        }}
        open={mobile ? mobileOpen : true}
        onClose={handleClose}
      >
        <div className={classes.toolbar} />
        <div className={classes.categoryList}>
          <CategoryList />
        </div>
        <div className={classes.grow} />
        {mobile && (
          <List>
            <Divider component='li' />
            <li>
              <Typography
                className={classes.dividerFullWidth}
                color='textSecondary'
                display='block'
                variant='caption'
              >
                Área Cliente
              </Typography>
            </li>
            {username ? (
              <>
                <li>
                  <Typography className={classes.dividerFullWidth} display='block' variant='h6'>
                    {`Olá, ${username}!`}
                    <Emoji symbol='👋' />
                  </Typography>
                </li>
                <Link href='/dashboard'>
                  <ListItem button>
                    <ListItemText primary='Minha Conta' />
                  </ListItem>
                </Link>
                <ListItem button onClick={logout}>
                  <ListItemText primary='Sair' />
                </ListItem>
              </>
            ) : (
              <>
                <Link href='/signin'>
                  <ListItem button>
                    <ListItemText primary='Iniciar Sessão' />
                  </ListItem>
                </Link>
                <Link href='/signup'>
                  <ListItem button>
                    <ListItemText primary='Registar' />
                  </ListItem>
                </Link>
              </>
            )}
          </List>
        )}
      </Drawer>
    </nav>
  );
};

CategoryDrawer.propTypes = {
  mobile: PropTypes.bool,
  mobileOpen: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
};

CategoryDrawer.defaultProps = {
  mobile: false,
  mobileOpen: false,
};

export default CategoryDrawer;
