import { Divider, Drawer, List, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import CategoryList from '../categories/CategoryList';
import AccountMenu from './AccountMenu';

const useStyles = makeStyles((theme) => ({
  drawer: {
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      width: process.env.appbar.drawerWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar
  toolbar: {
    height: process.env.appbar.desktopHeight,
    [theme.breakpoints.down('sm')]: {
      height: 0,
    },
  },
  drawerPaper: {
    width: process.env.appbar.drawerWidth,
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
            <AccountMenu />
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
