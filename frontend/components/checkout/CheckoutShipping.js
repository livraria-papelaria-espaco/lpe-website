import { Checkbox, Collapse, FormControlLabel } from '@material-ui/core';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CheckoutAddress from './CheckoutAddress';
import CheckoutShippingMethod from './CheckoutShippingMethod';

const CheckoutShipping = ({ state, dispatch, children }) => {
  const [addressReady, setAddressReady] = useState(false);

  const setAddressValue = (field, value) =>
    dispatch({ type: 'setValueDeep', field: ['shippingAddress', field], value });

  const handleCheckboxChange = (e) =>
    dispatch({ type: 'setValue', field: 'useSameAddress', value: e.target.checked });

  const handleShippingMethodChange = (e) =>
    dispatch({ type: 'setValue', field: 'shippingMethod', value: e.target.value });

  const useSameAddress = state.get('useSameAddress', true);
  const shippingMethod = state.get('shippingMethod', '');

  return (
    <div>
      <CheckoutShippingMethod value={shippingMethod} handleChange={handleShippingMethodChange} />
      <Collapse in={!!shippingMethod && shippingMethod !== 'STORE_PICKUP'}>
        <FormControlLabel
          control={
            <Checkbox checked={useSameAddress} onChange={handleCheckboxChange} color='primary' />
          }
          label='Usar os dados de faturação como morada de entrega'
        />
        <CheckoutAddress
          value={state.get(useSameAddress ? 'billingAddress' : 'shippingAddress')}
          setValue={setAddressValue}
          setReady={setAddressReady}
          disabled={useSameAddress}
        />
      </Collapse>
      {children(shippingMethod !== 'STORE_PICKUP' && !addressReady)}
    </div>
  );
};

CheckoutShipping.propTypes = {
  state: PropTypes.instanceOf(Map).isRequired,
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
};

export default CheckoutShipping;
