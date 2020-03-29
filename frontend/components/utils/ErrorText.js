import { Alert } from '@material-ui/lab';
import PropTypes from 'prop-types';
import React from 'react';

const ErrorText = ({ error }) => {
  if (error && process.env.NODE_ENV !== 'production') console.error(error);
  return <Alert severity='warning'>Ocorreu um erro</Alert>;
};

ErrorText.propTypes = {
  error: PropTypes.string,
};

ErrorText.defaultProps = {
  error: undefined,
};

export default ErrorText;
