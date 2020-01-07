import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import App from 'next/app';
import React from 'react';
import withData from '../lib/apollo';
import Head from 'next/head';
import { CartProvider } from '../components/context/CartContext';

let theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: green,
  },
  status: {
    danger: 'orange',
  },
});
theme = responsiveFontSizes(theme);

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
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
