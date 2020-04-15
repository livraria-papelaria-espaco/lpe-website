import {
  Divider,
  Drawer,
  List,
  Typography,
  ListItem,
  ListItemText,
  Link as MUILink,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';
import CloseIcon from '@material-ui/icons/CloseRounded';
import CategoryList from '../categories/CategoryList';
import AccountMenu from './AccountMenu';
import drawerHeaderUrl from '~/assets/drawerHeader.png';

const useStyles = makeStyles((theme) => ({
  drawer: {
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      width: process.env.appbar.drawerWidthDesktop,
      flexShrink: 0,
    },
  },
  toolbar: {
    width: '100%',
  },
  drawerPaper: {
    width: process.env.appbar.drawerWidthDesktop,
    [theme.breakpoints.down('sm')]: {
      width: process.env.appbar.drawerWidthMobile,
    },
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
  closeButton: {
    margin: theme.spacing(2),
    color: theme.palette.text.secondary,
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
        anchor={mobile ? 'left' : 'right'}
      >
        <div className={classes.drawerHeader}>
          <Button
            onClick={handleClose}
            startIcon={<CloseIcon />}
            size='small'
            className={classes.closeButton}
          >
            Fechar
          </Button>
          <img src={drawerHeaderUrl} alt='Categorias' className={classes.toolbar} />
        </div>
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
