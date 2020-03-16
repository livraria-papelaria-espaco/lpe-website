import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import { CartProvider } from '~/hooks/useCart';
import { withApollo } from '~/lib/apollo';
import { AuthProvider } from '~/hooks/useAuth';

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

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
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
  }
}
export default withApollo(MyApp);
