import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Head from 'next/head';
import Router from 'next/router';
import React from 'react';
import { AuthProvider } from '~/hooks/useAuth';
import { CartProvider } from '~/hooks/useCart';
import { withApollo } from '~/lib/apollo';
import * as gtag from '../lib/gtag';
import { ProductFiltersProvider } from '~/hooks/useProductFilters';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#273377',
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
      <ProductFiltersProvider>
        <ThemeProvider theme={theme}>
          <Head>
            {/* PWA primary color */}
            <meta name='theme-color' content={theme.palette.primary.main} />
          </Head>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </ThemeProvider>
      </ProductFiltersProvider>
    </CartProvider>
  </AuthProvider>
);

Router.events.on('routeChangeComplete', (url) => gtag.pageview(url));

export default withApollo(MyApp, { ssr: false });
