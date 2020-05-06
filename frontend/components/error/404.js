import React from 'react';
import OtherErrorPage from './OtherErrors';

const NotFound = () => {
  return (
    <OtherErrorPage
      errorCode={404}
      errorMessage='Página não encontrada'
      title='Página não encontrada'
    />
  );
};

export default NotFound;
