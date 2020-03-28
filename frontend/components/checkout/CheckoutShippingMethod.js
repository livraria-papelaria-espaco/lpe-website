import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const CheckoutShippingMethod = ({ value, handleChange }) => {
  return (
    <FormControl component='fieldset'>
      <RadioGroup
        aria-label='store pickup'
        name='storePickup'
        value={value}
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

CheckoutShippingMethod.propTypes = {
  value: PropTypes.oneOf(['', 'STORE_PICKUP', 'CTT']),
  handleChange: PropTypes.func.isRequired,
};

CheckoutShippingMethod.defaultProps = {
  value: '',
};

export default CheckoutShippingMethod;
