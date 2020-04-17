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

const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

const PasswordReset = () => {
  const classes = useStyles();
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onEmailChange = (evt) => setEmail(evt.target.value);
  const emailError = !emailRegExp.test(email);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (emailError) {
      setError('Email inválido');
      return;
    }
    setLoading(true);
    try {
      const requestSuccess = await forgotPassword(email);
      if (!requestSuccess) {
        setError('O email introduzido não está associado a nenhuma conta');
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch (ex) {
      setError('O email introduzido não está associado a nenhuma conta');
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout title='Recuperar palavra-passe' cardTitle='Recuperar palavra-passe'>
      {success ? (
        <Alert severity='success' className={classes.alert}>
          Foi enviado um email para {email} com instruções para recuperar a palavra-passe
        </Alert>
      ) : (
        <>
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
                error={email.length > 0 && emailError}
                disabled={loading}
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
                Pedir reposição de palavra-passe
              </Button>
              {loading && <CircularProgress size={24} className={classes.loading} />}
            </div>
          </form>
        </>
      )}
      <Typography variant='body2'>
        <Link
          href={{ pathname: '/auth/signin', query: { redirect: router.query.redirect || '/' } }}
          passHref
          replace
        >
          <MUILink>
            <strong>Iniciar Sessão</strong>
          </MUILink>
        </Link>
        {' | '}
        <Link
          href={{ pathname: '/auth/signup', query: { redirect: router.query.redirect || '/' } }}
          passHref
          replace
        >
          <MUILink>
            <strong>Registar</strong>
          </MUILink>
        </Link>
      </Typography>
    </AuthPageLayout>
  );
};

export default PasswordReset;
