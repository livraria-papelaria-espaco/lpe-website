import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';

const CheckoutPaymentGateway = ({ value, setValue, disableStore }) => {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <FormControl component='fieldset'>
        <FormLabel component='legend'>Escolher meio de pagamento</FormLabel>
        <RadioGroup
          aria-label='payment gateway'
          name='paymentGateway'
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value='IN_STORE'
            control={<Radio />}
            label='Pagar em loja'
            disabled={disableStore}
          />
          <FormControlLabel value='MB' control={<Radio />} label='Referência Multibanco' />
          <FormControlLabel value='MBWAY' control={<Radio />} label='MBWay' />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default CheckoutPaymentGateway;
