import { FormControl, FormLabel, TextField } from '@material-ui/core';
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

export default CheckoutMbWayPhone;
