import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Head from 'next/head';
import React from 'react';
import { AuthProvider } from '~/hooks/useAuth';
import { CartProvider } from '~/hooks/useCart';
import { withApollo } from '~/lib/apollo';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1565c0',
    },
    secondary: {
      main: '#ffa000',
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

export default withApollo(MyApp, { ssr: false });
