import { FormControl, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const CheckoutMbWayPhone = ({ value, handleChange, error }) => {
  const localError = error && !!value;
  return (
    <FormControl component='fieldset'>
      <TextField
        label='Telemóvel'
        helperText={localError ? 'Deve estar no formato 9XXXXXXXX' : 'Telemóvel associado ao MBWay'}
        value={value}
        onChange={handleChange}
        error={localError}
      />
    </FormControl>
  );
};

CheckoutMbWayPhone.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
};

CheckoutMbWayPhone.defaultProps = {
  value: '',
  error: false,
};

export default CheckoutMbWayPhone;
