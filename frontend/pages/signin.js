import {
  Button,
  Container,
  Link as MUILink,
  makeStyles,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import BackIcon from '@material-ui/icons/ArrowBackRounded';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '~/components/Layout';
import { useAuth } from '~/hooks/useAuth';
import LogoSvg from '../assets/logo.svg'; // TODO fix relative import

const useStyles = makeStyles((theme) => ({
  logo: {
    fill: theme.palette.primary.main,
    maxWidth: 200,
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(4),
    width: '100%',
    textAlign: 'center',
  },
  fieldDiv: {
    margin: theme.spacing(2),
    maxWidth: 500,
  },
  buttonArea: {
    padding: theme.spacing(2),
    width: '100%',
    position: 'relative',
  },
  backContainer: {
    textAlign: 'left',
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
  },
  submitButton: {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 20%, ${theme.palette.primary.light} 70%)`,
    '&$buttonDisabled': {
      background: theme.palette.action.disabledBackground,
    },
  },
  buttonDisabled: {},
  alert: {
    margin: theme.spacing(2),
  },
  loading: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const SignIn = () => {
  const classes = useStyles();
  const router = useRouter();
  const { isAuthenticated, login } = useAuth(); // TODO use "loading" and wait before displaying form

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onEmailChange = (evt) => setEmail(evt.target.value);
  const onPasswordChange = (evt) => setPassword(evt.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) router.replace(router.query.redirect || '/');
  }, [isAuthenticated]);

  return (
    <Layout title='Iniciar Sessão' hideNavbar colorBackground>
      <Container maxWidth='sm' className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.backContainer}>
            <MUILink href='#' onClick={router.back} className={classes.backLink} underline='none'>
              <BackIcon />
              <strong>Voltar</strong>
            </MUILink>
          </div>
          <LogoSvg className={classes.logo} />
          <Typography variant='h4' component='h1'>
            Iniciar Sessão
          </Typography>
          {error && (
            <Alert onClose={() => setError(false)} severity='error' className={classes.alert}>
              Dados de início de sessão incorretos!
            </Alert>
          )}
          <form noValidate>
            <div className={classes.fieldDiv}>
              <TextField
                id='email'
                label='Email'
                value={email}
                onChange={onEmailChange}
                type='email'
                variant='outlined'
                fullWidth
              />
            </div>
            <div className={classes.fieldDiv}>
              <TextField
                id='password'
                label='Palavra Passe'
                value={password}
                onChange={onPasswordChange}
                type='password'
                variant='outlined'
                fullWidth
              />
            </div>
            <div className={classes.buttonArea}>
              <Button
                type='submit'
                color='primary'
                onClick={onSubmit}
                variant='contained'
                fullWidth
                classes={{
                  root: classes.submitButton,
                  disabled: classes.buttonDisabled,
                }}
                disabled={loading}
              >
                Iniciar Sessão
              </Button>
              {loading && <CircularProgress size={24} className={classes.loading} />}
            </div>
          </form>
          <Typography variant='body2'>
            <Link
              href={{ pathname: '/signup', query: { redirect: router.query.redirect || '/' } }}
              passHref
              replace
            >
              <MUILink>
                <strong>Ainda não tem uma conta? Registe-se!</strong>
              </MUILink>
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
};

export default SignIn;
