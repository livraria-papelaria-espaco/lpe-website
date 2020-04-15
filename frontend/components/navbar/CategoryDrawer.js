import {
  Divider,
  Drawer,
  List,
  Typography,
  ListItem,
  ListItemText,
  Link as MUILink,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';
import CategoryList from '../categories/CategoryList';
import AccountMenu from './AccountMenu';
import drawerHeaderUrl from '~/assets/drawerHeader.png';

const useStyles = makeStyles((theme) => ({
  drawer: {
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      width: process.env.appbar.drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: {
    width: '100%',
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

const CategoryDrawer = ({ mobile, open, setOpen }) => {
  const classes = useStyles();

  const handleClose = () => setOpen(false);

  return (
    <nav className={classes.drawer}>
      <Drawer
        variant={mobile ? 'temporary' : 'temporary'}
        classes={{
          paper: classes.drawerPaper,
        }}
        open={open}
        onClose={handleClose}
        anchor='right'
      >
        <img src={drawerHeaderUrl} alt='Categorias' className={classes.toolbar} />
        <div className={classes.categoryList}>
          <CategoryList />
          <Divider />
          <List>
            <Link href='/newsroom'>
              <ListItem button component={MUILink} color='inherit' underline='none'>
                <ListItemText>Destaques</ListItemText>
              </ListItem>
            </Link>
          </List>
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
  open: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
};

CategoryDrawer.defaultProps = {
  mobile: false,
  open: false,
};

export default CategoryDrawer;
