import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';

const CheckoutShippingMethod = ({ value, handleChange }) => {
  return (
    <FormControl component='fieldset'>
      <RadioGroup
        aria-label='store pickup'
        name='storePickup'
        value={String(value)}
        onChange={handleChange}
      >
        <FormControlLabel
          value='STORE_PICKUP'
          control={<Radio color='primary' />}
          label='Recolher em loja'
        />
        <FormControlLabel value='CTT' control={<Radio color='primary' />} label='Envio via CTT' />
      </RadioGroup>
    </FormControl>
  );
};

export default CheckoutShippingMethod;
