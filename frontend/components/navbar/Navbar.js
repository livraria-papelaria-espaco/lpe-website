import { useMediaQuery, Drawer, List } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CategoryDrawer from './CategoryDrawer';
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';
import AccountMenu from './AccountMenu';

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
      {hideStoreNav && isMobile && (
        <Drawer anchor='bottom' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <List>
            <AccountMenu />
          </List>
        </Drawer>
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
