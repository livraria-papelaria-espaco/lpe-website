import { Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '~/hooks/useAuth';

const Profile = () => {
  useAuth({ secure: true });
  return (
    <div>
      <Typography variant='h1'>Área Cliente</Typography>
      <Link href='/dashboard/orders'>
        <a>Suas encomendas</a>
      </Link>
    </div>
  );
};

export default Profile;
