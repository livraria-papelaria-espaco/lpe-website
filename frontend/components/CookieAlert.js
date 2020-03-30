import { Button, Link as MUILink, Typography } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed !important',
    bottom: 0,
    left: 0,
    backgroundColor: fade(theme.palette.secondary.main, 0.95),
    color: theme.palette.secondary.contrastText,
    zIndex: 5000,
    width: '100%',
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
}));

const CookieAlert = ({ onAccept }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant='body1'>
        Este site utiliza <em>cookies</em> para uma melhor experiência de navegação. Ao navegar
        consente a sua utilização.{' '}
        <Link href='/legal/privacy' passHref>
          <MUILink underline='always' color='inherit'>
            Saiba mais aqui
          </MUILink>
        </Link>
        .
      </Typography>
      <Button onClick={onAccept} variant='outlined' color='inherit' size='small'>
        Entendi
      </Button>
    </div>
  );
};

CookieAlert.propTypes = {
  onAccept: PropTypes.func.isRequired,
};

export default CookieAlert;
