import { Button, Container, Paper, TextField, Typography } from '@material-ui/core';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import defaultPage from '../hocs/defaultPage';
import { strapiLogin } from '../lib/auth';

const SignIn = ({ isAuthenticated }) => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onEmailChange = (evt) => setEmail(evt.target.value);
  const onPasswordChange = (evt) => setPassword(evt.target.value);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await strapiLogin(email, password, router.query.redirect);
    } catch (e) {
      setError('Email e/ou palavra passe incorretos');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) router.push(router.query.redirect || '/');
  }, [isAuthenticated]);

  return (
    <Layout title='Iniciar Sessão'>
      <Container maxWidth='sm'>
        <Paper>
          <Typography variant='body1'>{error}</Typography>
          {loading && <Typography variant='body1'>Loading...</Typography>}
          <form>
            <div>
              <TextField
                id='email'
                label='Email'
                value={email}
                onChange={onEmailChange}
                type='email'
                variant='outlined'
              />
            </div>
            <div>
              <TextField
                id='password'
                label='Palavra Passe'
                value={password}
                onChange={onPasswordChange}
                type='password'
                variant='outlined'
              />
            </div>
            <Button color='primary' onClick={onSubmit}>
              Iniciar Sessão
            </Button>
          </form>
        </Paper>
      </Container>
    </Layout>
  );
};

export default defaultPage(SignIn);
