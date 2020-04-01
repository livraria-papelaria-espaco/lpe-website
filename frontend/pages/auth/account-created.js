import { Link as MUILink } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import AuthPageLayout from '~/components/auth/AuthPageLayout';

const AccountCreated = () => {
  const router = useRouter();

  return (
    <AuthPageLayout title='Registar' cardTitle='Conta criada com successo!'>
      <Alert severity='success'>
        <span>
          A sua conta foi criada com sucesso! Enviámos-lhe um email para ativar a sua conta. Apenas
          poderá{' '}
          <Link
            href={{ pathname: '/auth/signin', query: { redirect: router.query.redirect || '/' } }}
            passHref
            replace
          >
            <MUILink>iniciar sessão</MUILink>
          </Link>{' '}
          após a ativação da conta.
        </span>
      </Alert>
    </AuthPageLayout>
  );
};

export default AccountCreated;
