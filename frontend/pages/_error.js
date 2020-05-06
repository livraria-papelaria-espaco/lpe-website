import PropTypes from 'prop-types';
import React from 'react';
import OtherErrorPage from '~/components/error/OtherErrors';

const ErrorPage = ({ statusCode }) => {
  return <OtherErrorPage errorCode={statusCode} />;
};

ErrorPage.propTypes = {
  statusCode: PropTypes.number.isRequired,
};

export default ErrorPage;
