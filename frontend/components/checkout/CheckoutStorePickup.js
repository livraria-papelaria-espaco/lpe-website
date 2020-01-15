import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';

const CheckoutStorePickup = ({ value, setValue }) => {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl component='fieldset'>
      <FormLabel component='legend'>Escolher tipo de encomenda</FormLabel>
      <RadioGroup
        aria-label='store pickup'
        name='storePickup'
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value='true' control={<Radio />} label='Recolher em loja' />
        <FormControlLabel value='false' control={<Radio />} label='Enviar para casa' />
      </RadioGroup>
    </FormControl>
  );
};

export default CheckoutStorePickup;
