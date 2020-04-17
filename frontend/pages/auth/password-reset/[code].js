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
  const { changePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const { code } = router.query;

  const onPasswordChange = (evt) => setPassword(evt.target.value);
  const onPasswordConfirmationChange = (evt) => setPasswordConfirmation(evt.target.value);

  const passwordError = !passwordRegExp.test(password);

  const onSubmit = async (e) => {
    e.preventDefault();
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
      await changePassword(password, code);
    } catch (ex) {
      if (
        ex.message === 'Auth.form.error.confirmed' ||
        JSON.stringify(ex).indexOf('Auth.form.error.confirmed') !== -1
      ) {
        setWarning(
          'A sua palavra-passe foi alterada mas o email da sua conta ainda não foi confirmado.'
        );
        setLoading(false);
        return;
      }
      // TODO get errors from backend
      setError('Ocorreu um erro ao alterar a palavra-passe!');
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout title='Reposição da palavra-passe' cardTitle='Reposição da palavra-passe'>
      {!!warning && (
        <Alert onClose={() => setWarning('')} severity='warning' className={classes.alert}>
          {warning}
        </Alert>
      )}
      {!!error && (
        <Alert onClose={() => setError('')} severity='error' className={classes.alert}>
          {error}
        </Alert>
      )}
      <form noValidate>
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
            disabled={loading}
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
            Alterar palavra-passe
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

export default SignUp;
