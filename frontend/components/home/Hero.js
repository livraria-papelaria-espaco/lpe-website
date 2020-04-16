import { Typography, Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Link from 'next/link';
import BackgroundImg from '~/assets/background.jpg';
import LogoSvg from '~/assets/logo.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    background: `url(${BackgroundImg}) center right no-repeat fixed padding-box content-box`,
    color: theme.palette.primary.contrastText,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  after: {
    position: 'absolute',
    borderRadius: '80% 80% 0 0 / 70% 70% 0 0',
    background: theme.palette.background.default,
    height: '20vh',
    width: '120%',
    bottom: '-15vh',
    left: 0,
    transform: 'translateX(-10%)',
  },
  container: {
    flexGrow: 1,
    paddingTop: theme.spacing(35),
    paddingBottom: theme.spacing(6),
  },
  logo: {
    height: 150,
    fill: theme.palette.primary.contrastText,
    marginBottom: theme.spacing(4),
  },
  containedButton: {
    backgroundColor: theme.palette.primary.contrastText,
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

const Hero = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container fixed className={classes.container}>
        <LogoSvg className={classes.logo} />
        <Typography variant='h3' component='h1' gutterBottom>
          Livraria e Papelaria Espaço
        </Typography>
        <div>
          <Link href='/search' passHref>
            <Button
              variant='contained'
              color='default'
              size='medium'
              className={`${classes.button} ${classes.containedButton}`}
            >
              Visitar loja
            </Button>
          </Link>
          <Button href='#about-us' variant='outlined' color='inherit' className={classes.button}>
            Sobre nós
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
