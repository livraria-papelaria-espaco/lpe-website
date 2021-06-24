import { useMutation, useQuery } from '@apollo/client';
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
        confirmed
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
        confirmed
      }
    }
  }
`;

const EMAIL_CONFIRMATION_MUTATION = gql`
  mutation EMAIL_CONFIRMATION_MUTATION($code: String!) {
    emailConfirmation(confirmation: $code) {
      jwt
      user {
        username
        confirmed
      }
    }
  }
`;

const FORGOT_PASSWORD_MUTATION = gql`
  mutation FORGOT_PASSWORD_MUTATION($email: String!) {
    forgotPassword(email: $email) {
      ok
    }
  }
`;

const CHANGE_PASSWORD_MUTATION = gql`
  mutation CHANGE_PASSWORD_MUTATION($password: String!, $code: String!) {
    resetPassword(password: $password, passwordConfirmation: $password, code: $code) {
      jwt
      user {
        username
        confirmed
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
        pathname: '/auth/signin',
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
  const [requestEmailConfirmation] = useMutation(EMAIL_CONFIRMATION_MUTATION);
  const [requestForgotPassword] = useMutation(FORGOT_PASSWORD_MUTATION);
  const [requestChangePassword] = useMutation(CHANGE_PASSWORD_MUTATION);

  const login = async (identifier, password) => {
    const { data: res } = await requestLogin({ variables: { identifier, password } });
    if (!res.login.user.confirmed) throw new Error('Auth.form.error.confirmed');
    Cookies.set('jwt', res.login.jwt);

    if (window && window.gtag) {
      window.gtag('event', 'login', { method: 'Email' });
    }

    setUsername(res.login.user.username);
    window.localStorage.setItem('login', Date.now());
    return res;
  };

  const register = async (name, password, email) => {
    const { data: res } = await requestRegister({ variables: { name, password, email } });

    if (window && window.gtag) {
      window.gtag('event', 'sign_up', { method: 'Email' });
    }

    if (!res.register.user.confirmed) throw new Error('Auth.form.error.confirmed');
    Cookies.set('jwt', res.register.jwt);
    setUsername(res.register.user.username);
    window.localStorage.setItem('login', Date.now());
    return res;
  };

  const confirmEmail = async (code) => {
    const { data: res } = await requestEmailConfirmation({ variables: { code } });
    Cookies.set('jwt', res.emailConfirmation.jwt);
    setUsername(res.emailConfirmation.user.username);
    window.localStorage.setItem('login', Date.now());
    return res;
  };

  const forgotPassword = async (email) => {
    const { data: res } = await requestForgotPassword({ variables: { email } });
    return res.forgotPassword.ok;
  };

  const changePassword = async (password, code) => {
    const { data: res } = await requestChangePassword({ variables: { password, code } });
    if (!res.resetPassword.user.confirmed) throw new Error('Auth.form.error.confirmed');
    Cookies.set('jwt', res.resetPassword.jwt);
    setUsername(res.resetPassword.user.username);
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
    confirmEmail,
    forgotPassword,
    changePassword,
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
