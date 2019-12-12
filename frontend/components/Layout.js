import { Container, CssBaseline } from "@material-ui/core";
import Head from "next/head";
import React from "react";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const Layout = ({ title, children }) => (
  <div>
    <Head>
      <title>{`${title} | ${publicRuntimeConfig.siteTitle}`}</title>
    </Head>
    <CssBaseline />
    <Container fixed>{children}</Container>
  </div>
);

export default Layout;
