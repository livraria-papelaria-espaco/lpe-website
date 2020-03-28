import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Head from 'next/head';
import Router from 'next/router';
import React from 'react';
import { AuthProvider } from '~/hooks/useAuth';
import { CartProvider } from '~/hooks/useCart';
import { withApollo } from '~/lib/apollo';
import * as gtag from '../lib/gtag';
import { SearchProvider } from '~/hooks/useSearch';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#03a9f4',
    },
    secondary: {
      main: '#263238',
    },
  },
  typography: {
    fontFamily: ['"Baloo 2"', 'Roboto', 'cursive'],
  },
});
theme = responsiveFontSizes(theme);

// eslint-disable-next-line react/prop-types
const MyApp = ({ Component, pageProps }) => (
  <AuthProvider>
    <CartProvider>
      <SearchProvider>
        <ThemeProvider theme={theme}>
          <Head>
            {/* PWA primary color */}
            <meta name='theme-color' content={theme.palette.primary.main} />
          </Head>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </ThemeProvider>
      </SearchProvider>
    </CartProvider>
  </AuthProvider>
);

Router.events.on('routeChangeComplete', (url) => gtag.pageview(url));

export default withApollo(MyApp, { ssr: false });
