import { Alert } from '@material-ui/lab';
import React from 'react';

const StoreClosed = () => {
  return (
    <Alert severity='error'>
      Infelizmente a loja encontra-se encerrada. Visite a página inicial para mais informações.
    </Alert>
  );
};

export default StoreClosed;
