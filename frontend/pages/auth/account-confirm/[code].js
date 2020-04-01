import { Alert } from '@material-ui/lab';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AuthPageLayout from '~/components/auth/AuthPageLayout';
import LoadingPage from '~/components/utils/LoadingPage';
import { useAuth } from '~/hooks/useAuth';

const AccountConfirm = () => {
  const router = useRouter();
  const { confirmEmail } = useAuth();
  const [error, setError] = useState(false);

  const { code } = router.query || {};

  useEffect(() => {
    let valid = true;

    const execute = async () => {
      setError(false);
      try {
        await confirmEmail(code);
      } catch (e) {
        if (valid) setError(true);
      }
    };

    execute();

    return () => {
      valid = false;
    };
  }, [code]);

  return (
    <AuthPageLayout title='Confirmação da conta' cardTitle='A confirmar conta...'>
      {error ? (
        <Alert severity='error'>Código de confirmação incorreto!</Alert>
      ) : (
        <LoadingPage height={20} />
      )}
    </AuthPageLayout>
  );
};

export default AccountConfirm;
