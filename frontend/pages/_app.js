import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import { CartProvider } from '../components/context/CartContext';
import withData from '../lib/apollo';

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
      <CartProvider>
        <ThemeProvider theme={theme}>
          <Head>
            {/* PWA primary color */}
            <meta name='theme-color' content={theme.palette.primary.main} />
          </Head>
          <Component {...pageProps} />
        </ThemeProvider>
      </CartProvider>
    );
  }
}
export default withData(MyApp);
