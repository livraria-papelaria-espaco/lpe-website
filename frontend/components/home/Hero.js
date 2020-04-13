import { Typography, Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 20%, ${theme.palette.primary.light} 70%)`,
    color: theme.palette.primary.contrastText,
    marginTop: -theme.spacing(4),
    minHeight: '50vh',
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
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(6),
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
        <Typography variant='h3' component='h1' gutterBottom>
          Livraria e Papelaria Espaço
        </Typography>
        <div>
          <Button
            variant='contained'
            color='default'
            size='medium'
            className={`${classes.button} ${classes.containedButton}`}
          >
            Action 1
          </Button>
          <Button variant='outlined' color='inherit' className={classes.button}>
            Action 2
          </Button>
        </div>
      </Container>
      <div className={classes.after} />
    </div>
  );
};

export default Hero;
