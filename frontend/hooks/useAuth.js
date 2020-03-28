import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
  mutation REGISTER_MUTATION($name: String!, $password: String!, $email: String!) {
    register(input: { username: $name, password: $password, email: $email }) {
      jwt
      user {
        username
      }
    }
  }
`;

const authContext = createContext();

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
  const [username, setUsername] = useState(undefined);
  const [requestLogin] = useMutation(LOGIN_MUTATION);
  const [requestRegister] = useMutation(REGISTER_MUTATION);

  const login = async (identifier, password) => {
    const { data: res } = await requestLogin({ variables: { identifier, password } });
    Cookies.set('jwt', res.login.jwt);
    setUsername(res.login.user.username);
    window.localStorage.setItem('login', Date.now());
    return res;
  };

  const register = async (name, password, email) => {
    const { data: res } = await requestRegister({ variables: { name, password, email } });
    Cookies.set('jwt', res.register.jwt);
    setUsername(res.register.user.username);
    window.localStorage.setItem('login', Date.now());
    return res;
  };

  const logout = () => {
    Cookies.remove('jwt');
    setUsername(null);
    window.localStorage.setItem('logout', Date.now());
  };

  const syncAuth = async (event) => {
    if (event.key === 'logout') setUsername(null);
    if (event.key === 'login') {
      const { data: res } = await refetch();
      if (res) setUsername(res.me.username);
    }
  };

  useEffect(() => {
    window.addEventListener('storage', syncAuth);

    return () => {
      window.removeEventListener('storage', syncAuth);
    };
  }, [syncAuth]);

  useEffect(() => {
    if (loading) return;
    if (data) setUsername(data.me.username);
    else setUsername(null);
  }, [data, loading, error]);

  return {
    isAuthenticated: username !== null && username !== undefined,
    loading: loading || username === undefined,
    username,
    login,
    register,
    logout,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
