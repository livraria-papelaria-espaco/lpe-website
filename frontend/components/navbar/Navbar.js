import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CategoryDrawer from './CategoryDrawer';
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';

const Navbar = ({ hideStoreNav, homePage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navComponent = isMobile ? (
    <MobileNavbar setDrawerOpen={setDrawerOpen} hideSearchBar={hideStoreNav} homePage={homePage} />
  ) : (
    <DesktopNavbar setDrawerOpen={setDrawerOpen} hideSearchBar={hideStoreNav} homePage={homePage} />
  );

  return (
    <>
      {navComponent}
      <CategoryDrawer mobile={isMobile} open={drawerOpen} setOpen={setDrawerOpen} />
    </>
  );
};

Navbar.propTypes = {
  hideStoreNav: PropTypes.bool,
  homePage: PropTypes.bool,
};

Navbar.defaultProps = {
  hideStoreNav: false,
  homePage: false,
};

export default Navbar;
