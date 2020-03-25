import { Checkbox, Collapse, FormControlLabel } from '@material-ui/core';
import React, { useState } from 'react';
import CheckoutAddress from './CheckoutAddress';
import CheckoutStorePickup from './CheckoutStorePickup';

const CheckoutShipping = ({ state, dispatch, children }) => {
  const [addressReady, setAddressReady] = useState(false);

  const setAddressValue = (field, value) =>
    dispatch({ type: 'setValueDeep', field: ['shippingAddress', field], value });

  const handleCheckboxChange = (e) =>
    dispatch({ type: 'setValue', field: 'useSameAddress', value: e.target.checked });

  const handleStorePickupChange = (e) =>
    dispatch({ type: 'setValue', field: 'storePickup', value: e.target.value === 'true' });

  const useSameAddress = state.get('useSameAddress', true);
  const storePickup = state.get('storePickup', null);

  return (
    <div>
      <CheckoutStorePickup value={storePickup} handleChange={handleStorePickupChange} />
      <Collapse in={!storePickup && storePickup !== null}>
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
      {children(!addressReady && !useSameAddress)}
    </div>
  );
};

export default CheckoutShipping;
