import { Button, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/styles';
import { subscribeToNewsletter } from '~/lib/newsletter';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  textContainer: {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 20%, ${theme.palette.primary.light} 70%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  input: {
    margin: theme.spacing(1),
  },
  submitButton: {
    margin: theme.spacing(1),
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 20%, ${theme.palette.primary.main} 70%)`,
    '&$buttonDisabled': {
      background: theme.palette.action.disabledBackground,
    },
  },
  buttonDisabled: {},
  alert: {
    margin: theme.spacing(1),
  },
}));

const Newsletter = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const subscribe = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email) {
      dispatchAlert('warning', 'Por favor preencha o email para subscrever a newsletter');
      return;
    }

    setLoading(true);
    const success = await subscribeToNewsletter(email, name);
    if (success) {
      dispatchAlert('success', 'Foi subscrito/a à newsletter da Espaço com sucesso!');
      setEmail('');
      setName('');
    } else {
      dispatchAlert('warning', 'O email introduzido é inválido');
    }
    setLoading(false);
  };

  const dispatchAlert = (severity, text) => {
    if (alert) {
      clearTimeout(alert.timeout);
    }
    const taskId = setTimeout(() => {
      setAlert(null);
    }, 3000);

    setAlert({ severity, text, timeout: taskId });
  };

  useEffect(() => {
    return () => {
      if (alert) {
        clearTimeout(alert.timeout);
      }
    };
  }, [alert]);

  return (
    <div className={classes.root}>
      <div className={classes.textContainer}>
        <Typography variant='h4'>Quer estar a par das novidades da Espaço?</Typography>
        <Typography variant='h5'>Subscreva já a nossa newsletter!</Typography>
      </div>
      {alert && (
        <Alert severity={alert?.severity || 'info'} className={classes.alert}>
          {alert?.text}
        </Alert>
      )}
      <form className={classes.form}>
        <div>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            label='Nome (opcional)'
            variant='outlined'
            className={classes.input}
          />
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label='Email'
            variant='outlined'
            type='email'
            required
            className={classes.input}
          />
        </div>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          classes={{
            root: classes.submitButton,
            disabled: classes.buttonDisabled,
          }}
          onClick={subscribe}
          disabled={loading}
        >
          Subscrever
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
