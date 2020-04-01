import { Typography } from '@material-ui/core';
import React from 'react';
import Layout from '~/components/Layout';
import BackArrow from '~/components/utils/BackArrow';

const ManageAcount = () => {
  return (
    <Layout title='Gerir conta'>
      <BackArrow link='/dashboard' />
      <Typography variant='h2' component='h1'>
        Gerir conta
      </Typography>
      <Typography>
        Ainda estamos a finalizar o nosso site.
        <br />
        Por esse motivo, esta funcionalidade ainda não se encontra disponível.
        <br />
        No entanto, é possível alterar a palavra-passe através do menu de início de sessão e
        clicando em &quot;Repor palavra-passe&quot;.
      </Typography>
      {/* TODO <PasswordChange /> */}
    </Layout>
  );
};

export default ManageAcount;
