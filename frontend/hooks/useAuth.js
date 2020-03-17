import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';

const authContext = createContext();

export const AuthProvider = ({ /*data,*/ children }) => {
  const auth = useAuthProvider(/*data*/);
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

//AuthProvider.getInitialProps = (ctx) => Cookies(ctx).jwt;

export const useAuth = ({ secure = false } = {}) => {
  const router = useRouter();
  const context = useContext(authContext);

  useEffect(() => {
    if (secure && !context.loading && !context.username)
      router.replace({
        pathname: '/signin',
        query: { redirect: router.asPath || '/' },
      });
  }, [context, router]);

  return context;
};

const useAuthProvider = () => {
  const { data, loading, error, refetch } = useQuery(ME_QUERY);
  const [username, setUsername] = useState(null);
  const [requestLogin] = useMutation(LOGIN_MUTATION);
  const [requestRegister] = useMutation(REGISTER_MUTATION);

  const login = async (identifier, password) => {
    const { data } = await requestLogin({ variables: { identifier, password } });
    Cookies.set('jwt', data.login.jwt);
    setUsername(data.login.user.username);
    window.localStorage.setItem('login', Date.now());
    return data;
  };

  const register = async (username, password, email) => {
    const { data } = await requestRegister({ variables: { username, password, email } });
    Cookies.set('jwt', data.register.jwt);
    setUsername(data.register.user.username);
    window.localStorage.setItem('login', Date.now());
    return data;
  };

  const logout = () => {
    Cookies.remove('jwt');
    setUsername(null);
    window.localStorage.setItem('logout', Date.now());
  };

  const syncAuth = async (event) => {
    if (event.key === 'logout') setUsername(null);
    if (event.key === 'login') {
      const { data } = await refetch();
      if (data) setUsername(data.me.username);
    }
  };

  useEffect(() => {
    if (data && !loading && !error) setUsername(data.me.username);

    window.addEventListener('storage', syncAuth);

    return () => {
      window.removeEventListener('storage', syncAuth);
    };
  }, [data, loading, error, setUsername, refetch]);

  return {
    isAuthenticated: username !== null,
    loading,
    username,
    login,
    register,
    logout,
  };
};

const ME_QUERY = gql`
  query ME_QUERY {
    me {
      username
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      jwt
      user {
        username
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation REGISTER_MUTATION($username: String!, $password: String!, $email: String!) {
    register(input: { username: $username, password: $password, email: $email }) {
      jwt
      user {
        username
      }
    }
  }
`;
