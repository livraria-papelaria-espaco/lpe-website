import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CheckoutAddress from './CheckoutAddress';

const useStyles = makeStyles((theme) => ({
  nif: {
    marginTop: theme.spacing(3),
  },
}));

const nifRegex = /^\d{9}$/;

const CheckoutClientData = ({ state, dispatch, children }) => {
  const classes = useStyles();
  const [addressReady, setAddressReady] = useState(false);

  const setAddressValue = (field, value) =>
    dispatch({ type: 'setValueDeep', field: ['billingAddress', field], value });

  const handleNifChange = (e) =>
    dispatch({ type: 'setValue', field: 'nif', value: e.target.value });

  const nif = state.get('nif', '');
  const isValidNif = nifRegex.test(nif);

  return (
    <div>
      <CheckoutAddress
        value={state.get('billingAddress')}
        setValue={setAddressValue}
        setReady={setAddressReady}
        required={false}
      />
      <TextField
        className={classes.nif}
        error={nif.length !== 0 && !isValidNif}
        label='NIF'
        fullWidth
        autoComplete='nif'
        value={nif}
        onChange={handleNifChange}
        helperText='Deixe em branco caso não pretenda NIF na fatura'
      />
      {children(!addressReady || (nif.length !== 0 && !isValidNif))}
    </div>
  );
};

CheckoutClientData.propTypes = {
  state: PropTypes.instanceOf(Map).isRequired,
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
};

export default CheckoutClientData;
