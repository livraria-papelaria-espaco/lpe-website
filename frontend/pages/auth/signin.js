import {
  Button,
  CircularProgress,
  Link as MUILink,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import AuthPageLayout from '~/components/auth/AuthPageLayout';
import { useAuth } from '~/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  fieldDiv: {
    margin: theme.spacing(2),
    maxWidth: 500,
  },
  buttonArea: {
    padding: theme.spacing(2),
    width: '100%',
    position: 'relative',
  },
  submitButton: {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 20%, ${theme.palette.primary.main} 70%)`,
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
  const { login } = useAuth(); // TODO use "loading" and wait before displaying form

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onEmailChange = (evt) => setEmail(evt.target.value);
  const onPasswordChange = (evt) => setPassword(evt.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (ex) {
      if (
        ex.message === 'Auth.form.error.confirmed' ||
        JSON.stringify(ex).indexOf('Auth.form.error.confirmed') !== -1
      )
        setError('Conta não confirmada! Por favor verifique o seu email.');
      else setError('Dados de início de sessão incorretos!');
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout title='Iniciar Sessão' cardTitle='Iniciar Sessão'>
      {!!error && (
        <Alert onClose={() => setError('')} severity='error' className={classes.alert}>
          {error}
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
          href={{ pathname: '/auth/signup', query: { redirect: router.query.redirect || '/' } }}
          passHref
          replace
        >
          <MUILink>
            <strong>Ainda não tem uma conta? Registe-se!</strong>
          </MUILink>
        </Link>
      </Typography>
      <Typography variant='body2'>
        <Link
          href={{
            pathname: '/auth/password-reset',
            query: { redirect: router.query.redirect || '/' },
          }}
          passHref
          replace
        >
          <MUILink>
            <strong>Repor palavra-passe</strong>
          </MUILink>
        </Link>
      </Typography>
    </AuthPageLayout>
  );
};

export default SignIn;
