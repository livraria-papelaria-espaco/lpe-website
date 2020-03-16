import { useRouter } from 'next/router';
import React from 'react';
import defaultPage from './defaultPage';

const securePageHoc = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    React.useEffect(() => {
      if (!props.isAuthenticated)
        router.replace({
          pathname: '/signin',
          query: { redirect: props.currentUrl || '/' },
        });
    }, [props.isAuthenticated]);
    return props.isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  Wrapper.getInitialProps = async (ctx) => {
    const componentProps =
      WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
    return { ...componentProps };
  };

  return Wrapper;
};

export default (Page) => defaultPage(securePageHoc(Page));
