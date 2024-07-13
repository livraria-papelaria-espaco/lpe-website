import { Collapse, FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import CheckoutMbWayPhone from './CheckoutMbWayPhone';

const mbWayPhoneRegex = /^9\d{8}$/;

const CheckoutPaymentGateway = ({ state, dispatch, disableEuPago, children }) => {
  const handleChange = (field) => (event) => {
    dispatch({ type: 'setValue', field, value: event.target.value });
  };

  const paymentGateway = state.get('paymentGateway', '');
  const invalidPaymentGatewayForShipping =
    paymentGateway === 'IN_STORE' && state.get('shippingMethod', '') !== 'STORE_PICKUP';
  const mbWayPhone = state.get('mbWayPhone', '');
  const isValidMbWayPhone = mbWayPhoneRegex.test(mbWayPhone);

  return (
    <div>
      <FormControl component='fieldset'>
        <RadioGroup
          aria-label='payment gateway'
          value={paymentGateway}
          onChange={handleChange('paymentGateway')}
        >
          <FormControlLabel
            value='IN_STORE'
            control={<Radio color='primary' />}
            label='Pagar em Loja'
            disabled={state.get('shippingMethod') !== 'STORE_PICKUP'}
          />
          {
            !disableEuPago && (
              <>
                <FormControlLabel
                  value='MB'
                  control={<Radio color='primary' />}
                  label='Referência Multibanco'
                />
                <FormControlLabel value='MBWAY' control={<Radio color='primary' />} label='MBWay' />
                <Collapse in={paymentGateway === 'MBWAY'}>
                  <CheckoutMbWayPhone
                    value={mbWayPhone}
                    handleChange={handleChange('mbWayPhone')}
                    error={!isValidMbWayPhone}
                  />
                </Collapse>
              </>
            )
          }
          <FormControlLabel
            value='BANK_TRANSFER'
            control={<Radio color='primary' />}
            label='Transferência Bancária'
          />
        </RadioGroup>
      </FormControl>
      {children(
        !paymentGateway ||
          (paymentGateway === 'MBWAY' && !isValidMbWayPhone) ||
          invalidPaymentGatewayForShipping
      )}
    </div>
  );
};

CheckoutPaymentGateway.propTypes = {
  state: PropTypes.instanceOf(Map).isRequired,
  dispatch: PropTypes.func.isRequired,
  disableEuPago: PropTypes.bool,
  children: PropTypes.func.isRequired,
};

CheckoutPaymentGateway.defaultProps = {
  disableEuPago: false,
};

export default CheckoutPaymentGateway;
