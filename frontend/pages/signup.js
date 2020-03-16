import { Button, Container, Paper, TextField, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '~/components/Layout';
import { useAuth } from '~/hooks/useAuth';

const SignUp = () => {
  const router = useRouter();
  const { isAuthenticated, register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onUsernameChange = (evt) => setUsername(evt.target.value);
  const onEmailChange = (evt) => setEmail(evt.target.value);
  const onPasswordChange = (evt) => setPassword(evt.target.value);

  const onSubmit = async () => {
    setLoading(true);
    try {
      await register(username, password, email);
    } catch (e) {
      setError('Ocorreu um erro ao criar uma conta');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) router.replace(router.query.redirect || '/');
  }, [isAuthenticated]);

  return (
    <Layout title='Iniciar Sessão' hideNavbar>
      <Container maxWidth='sm'>
        <Paper>
          <Typography variant='body1'>{error}</Typography>
          {loading && <Typography variant='body1'>Loading...</Typography>}
          <form>
            <div>
              <TextField
                id='username'
                label='Nome de utilizador'
                value={username}
                onChange={onUsernameChange}
                type='text'
                variant='outlined'
              />
            </div>
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
              Criar conta
            </Button>
          </form>
        </Paper>
      </Container>
    </Layout>
  );
};

export default SignUp;
