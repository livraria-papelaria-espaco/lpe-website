import { FormControl, FormLabel, TextField } from '@material-ui/core';
import React from 'react';

const regex = new RegExp(/^\d{9}$/);

const CheckoutMbWayPhone = ({ value, setValue }) => {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const error = !!value && !value.match(regex);

  return (
    <div>
      <FormControl component='fieldset'>
        <FormLabel component='legend'>Introduza o seu número de telemóvel</FormLabel>
        <TextField
          label='Telemóvel'
          helperText={error ? 'Deve estar no formato 9XXXXXXXX' : 'Telemóvel associado ao MBWay'}
          value={value}
          onChange={handleChange}
          error={error}
        />
      </FormControl>
    </div>
  );
};

export default CheckoutMbWayPhone;
