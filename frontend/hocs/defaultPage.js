import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { getUserFromLocalCookie, getUserFromServerCookie } from '../lib/auth';

export default (WrappedComponent) => {
  const Wrapper = (props) => {
    const { asPath } = useRouter();
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

    return <WrappedComponent currentUrl={asPath} {...props} />;
  };

  Wrapper.getInitialProps = async (ctx) => {
    const loggedUser = process.browser
      ? getUserFromLocalCookie()
      : getUserFromServerCookie(ctx.req);

    const componentProps =
      WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps, loggedUser, isAuthenticated: !!loggedUser };
  };

  return Wrapper;
};
