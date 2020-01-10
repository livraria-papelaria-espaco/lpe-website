import Router from 'next/router';
import React, { useEffect } from 'react';
import { getUserFromLocalCookie, getUserFromServerCookie } from '../lib/auth';

export default (WrappedComponent) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === 'logout') Router.push(`/?logout=${event.newValue}`);
    };

    useEffect(() => {
      window.addEventListener('storage', syncLogout);

      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logout');
      };
    }, []);

    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async (ctx) => {
    const loggedUser = process.browser
      ? getUserFromLocalCookie()
      : getUserFromServerCookie(ctx.req);
    let path = ctx.req ? ctx.req.url : '';

    const componentProps =
      WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps, loggedUser, currentUrl: path, isAuthenticated: !!loggedUser };
  };

  return Wrapper;
};
