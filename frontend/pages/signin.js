import { Button, Container, Paper, TextField, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '~/components/Layout';
import { useAuth } from '~/hooks/useAuth';

const SignIn = () => {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth(); // TODO use "loading" and wait before displaying form

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onEmailChange = (evt) => setEmail(evt.target.value);
  const onPasswordChange = (evt) => setPassword(evt.target.value);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      setError('Email e/ou palavra passe incorretos');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) router.replace(router.query.redirect || '/');
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

export default SignIn;
