import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CategoryDrawer from './CategoryDrawer';
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';

const Navbar = ({ hideStoreNav = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navComponent = isMobile ? (
    <MobileNavbar setDrawerOpen={setDrawerOpen} />
  ) : (
    <DesktopNavbar hideSearchBar={hideStoreNav} />
  );

  return (
    <>
      {navComponent}
      {!hideStoreNav && (
        <CategoryDrawer mobile={isMobile} mobileOpen={drawerOpen} setOpen={setDrawerOpen} />
      )}
    </>
  );
};

Navbar.propTypes = {
  hideStoreNav: PropTypes.bool,
};

Navbar.defaultProps = {
  hideStoreNav: false,
};

export default Navbar;
