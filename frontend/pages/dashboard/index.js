import { Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import securePage from '~/hocs/securePage';

const Profile = () => (
  <div>
    <Typography variant='h1'>Área Cliente</Typography>
    <Link href='/dashboard/orders'>
      <a>Suas encomendas</a>
    </Link>
  </div>
);

export default securePage(Profile);
