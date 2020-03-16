import { Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import Layout from '~/components/Layout';
import { useAuth } from '~/hooks/useAuth';

const Profile = () => {
  useAuth({ secure: true });
  return (
    <Layout title='Área Cliente'>
      <Typography variant='h1'>Área Cliente</Typography>
      <Link href='/dashboard/orders'>
        <a>Suas encomendas</a>
      </Link>
    </Layout>
  );
};

export default Profile;
