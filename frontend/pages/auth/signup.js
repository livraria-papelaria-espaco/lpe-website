import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
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
const usernameRegExp = /^[A-Za-z0-9_ ]{4,}$/;
const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

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

const SignUp = () => {
  const classes = useStyles();
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTos, setAcceptTos] = useState(false);

  const onUsernameChange = (evt) => setUsername(evt.target.value);
  const onEmailChange = (evt) => setEmail(evt.target.value);
  const onPasswordChange = (evt) => setPassword(evt.target.value);
  const onPasswordConfirmationChange = (evt) => setPasswordConfirmation(evt.target.value);
  const onAcceptTosChange = (evt) => setAcceptTos(evt.target.checked);

  const usernameError = !usernameRegExp.test(username);
  const emailError = !emailRegExp.test(email);
  const passwordError = !passwordRegExp.test(password);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (usernameError) {
      setError(
        'O nome de utilizador tem de ter, no mínimo, 4 catacteres e só pode conter letras, números, _ e espaços'
      );
      return;
    }
    if (emailError) {
      setError('Email inválido');
      return;
    }
    if (passwordError) {
      setError('A palavra-passe deverá conter, pelo menos, 8 caracteres e um dígito');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('As palavra-passes não correspondem');
      return;
    }
    setLoading(true);
    try {
      await register(username, password, email);
    } catch (ex) {
      if (
        ex.message === 'Auth.form.error.confirmed' ||
        JSON.stringify(ex).indexOf('Auth.form.error.confirmed') !== -1
      ) {
        router.replace({
          pathname: '/auth/account-created',
          query: { redirect: router.query.redirect || '/' },
        });
        return;
      }
      // TODO get errors from backend
      setError('Email e/ou username já em uso');
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout title='Registar' cardTitle='Registar'>
      {!!error && (
        <Alert onClose={() => setError('')} severity='error' className={classes.alert}>
          {error}
        </Alert>
      )}
      <form noValidate>
        <div className={classes.fieldDiv}>
          <TextField
            id='username'
            label='Nome de utilizador'
            value={username}
            onChange={onUsernameChange}
            type='text'
            variant='outlined'
            fullWidth
            error={username.length > 0 && usernameError}
          />
        </div>
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
            error={password.length > 0 && passwordError}
            helperText='Deverá conter, pelo menos, 8 caracteres e um dígito'
          />
        </div>
        <div className={classes.fieldDiv}>
          <TextField
            id='passwordConfirmation'
            label='Reintroduzir Palavra Passe'
            value={passwordConfirmation}
            onChange={onPasswordConfirmationChange}
            type='password'
            variant='outlined'
            fullWidth
            error={passwordConfirmation.length > 0 && passwordConfirmation !== password}
          />
        </div>
        <div className={classes.fieldDiv}>
          <FormControlLabel
            control={<Checkbox checked={acceptTos} onChange={onAcceptTosChange} color='primary' />}
            label={
              <span>
                Li e aceito os{' '}
                <Link href='/legal/tos' passHref>
                  <MUILink>Termos de Serviço</MUILink>
                </Link>{' '}
                e a{' '}
                <Link href='/legal/privacy' passHref>
                  <MUILink>Política de Privacidade</MUILink>
                </Link>
              </span>
            }
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
            disabled={!acceptTos || loading}
          >
            Criar Conta
          </Button>
          {loading && <CircularProgress size={24} className={classes.loading} />}
        </div>
      </form>
      <Typography variant='body2'>
        <Link
          href={{ pathname: '/auth/signin', query: { redirect: router.query.redirect || '/' } }}
          passHref
          replace
        >
          <MUILink>
            <strong>Já tem uma conta? Inicie sessão!</strong>
          </MUILink>
        </Link>
      </Typography>
    </AuthPageLayout>
  );
};

export default SignUp;
