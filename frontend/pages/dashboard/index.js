import React from 'react';
import securePage from '../../hocs/securePage';
import Link from 'next/link';
import { Typography } from '@material-ui/core';

const Profile = () => (
  <div>
    <Typography variant='h1'>Área Cliente</Typography>
    <Link href='/dashboard/orders'>
      <a>Suas encomendas</a>
    </Link>
  </div>
);

export default securePage(Profile);
