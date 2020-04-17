import {
  Button,
  Divider,
  Drawer,
  Link as MUILink,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/CloseRounded';
import HomeIcon from '@material-ui/icons/HomeRounded';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import CategoryList from '../categories/CategoryList';
import AccountMenu from './AccountMenu';
// import drawerHeaderUrl from '~/assets/drawerHeader.png';

const useStyles = makeStyles((theme) => ({
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
  buttonArea: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  closeButton: {
    margin: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

const CategoryDrawer = ({ mobile, open, setOpen }) => {
  const classes = useStyles();
  const router = useRouter();

  const handleClose = () => setOpen(false);

  return (
    <Drawer
      variant='temporary'
      classes={{
        paper: classes.drawerPaper,
      }}
      open={open}
      onClose={handleClose}
      anchor={mobile ? 'left' : 'right'}
    >
      <div>
        <div className={classes.buttonArea}>
          <Button
            onClick={handleClose}
            startIcon={<CloseIcon />}
            size='small'
            className={classes.closeButton}
          >
            Fechar
          </Button>
          {router.pathname !== '/' && (
            <Link href='/' passHref>
              <Button startIcon={<HomeIcon />} size='small' className={classes.closeButton}>
                Início
              </Button>
            </Link>
          )}
        </div>
        {/* <img src={drawerHeaderUrl} alt='Categorias' className={classes.toolbar} /> */}
      </div>
      <div className={classes.categoryList}>
        <CategoryList />
      </div>
      <Divider />
      <List>
        <Link href='/newsroom' passHref>
          <ListItem button component={MUILink} color='inherit' underline='none'>
            <ListItemText>Destaques</ListItemText>
          </ListItem>
        </Link>
      </List>
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
