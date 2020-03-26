import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Head from 'next/head';
import Router from 'next/router';
import React from 'react';
import { AuthProvider } from '~/hooks/useAuth';
import { CartProvider } from '~/hooks/useCart';
import { withApollo } from '~/lib/apollo';
import * as gtag from '../lib/gtag';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#03a9f4',
    },
    secondary: {
      main: '#263238',
    },
  },
});
theme = responsiveFontSizes(theme);

const MyApp = ({ Component, pageProps }) => (
  <AuthProvider>
    <CartProvider>
      <ThemeProvider theme={theme}>
        <Head>
          {/* PWA primary color */}
          <meta name='theme-color' content={theme.palette.primary.main} />
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </CartProvider>
  </AuthProvider>
);

Router.events.on('routeChangeComplete', (url) => gtag.pageview(url));

export default withApollo(MyApp, { ssr: false });
