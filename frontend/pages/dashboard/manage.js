import { Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import PasswordChange from '~/components/account/PasswordChange';
import Layout from '~/components/Layout';

const ManageAcount = () => {
  return (
    <Layout title='Gerir conta'>
      <Link href='/dashboard/'>
        <a>Voltar</a>
      </Link>
      <Typography variant='h4' component='h1'>
        Gerir conta
      </Typography>
      <PasswordChange />
    </Layout>
  );
};

export default ManageAcount;
