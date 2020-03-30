import { ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import React from 'react';
import Emoji from '~/components/utils/Emoji';
import { useAuth } from '~/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(2)}px`,
  },
}));

const AccountMenu = () => {
  const classes = useStyles();
  const { username, logout } = useAuth();
  if (username)
    return (
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
    );
  return (
    <>
      <Link href='/auth/signin'>
        <ListItem button>
          <ListItemText primary='Iniciar Sessão' />
        </ListItem>
      </Link>
      <Link href='/auth/signup'>
        <ListItem button>
          <ListItemText primary='Registar' />
        </ListItem>
      </Link>
    </>
  );
};

export default AccountMenu;
