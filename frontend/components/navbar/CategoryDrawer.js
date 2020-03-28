import { Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import getConfig from 'next/config';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CategoryList from '../products/CategoryList';

const { publicRuntimeConfig } = getConfig();

const { drawerWidth } = publicRuntimeConfig.appbar;

const useStyles = makeStyles((theme) => ({
  drawer: {
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
        <div>
          <CategoryList />
        </div>
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
