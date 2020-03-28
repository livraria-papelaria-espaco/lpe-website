import { FormControl, Grid, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const nameRegex = /\d/;
const postalCodeRegex = /^\d{4}-\d{3}$/;

const CheckoutAddress = ({ value, setValue, setReady, disabled }) => {
  const handleChange = (key) => (event) => {
    setValue(key, event.target.value);
  };

  const firstName = value.get('firstName', '');
  const lastName = value.get('lastName', '');
  const address1 = value.get('address1', '');
  const address2 = value.get('address2', '');
  const city = value.get('city', '');
  const postalCode = value.get('postalCode', '');

  const isValidName = (val) => !!val && val.length <= 20 && !nameRegex.test(val);
  const isValidAddress = (val) => !!val && val.length <= 50;
  const isValidCity = !!city && city.length <= 50;
  const isValidPostalCode = !!postalCode && postalCodeRegex.test(postalCode);

  useEffect(() => {
    setReady(
      isValidName(firstName) &&
        isValidName(lastName) &&
        isValidAddress(address1) &&
        isValidAddress(address2) &&
        isValidCity &&
        isValidPostalCode
    );
  }, [firstName, lastName, address1, address2, isValidCity, isValidPostalCode]);

  return (
    <FormControl component='fieldset'>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            error={firstName.length !== 0 && !isValidName(firstName)}
            required
            label='Nome próprio'
            fullWidth
            autoComplete='fname'
            value={firstName}
            onChange={handleChange('firstName')}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={lastName.length !== 0 && !isValidName(lastName)}
            required
            label='Apelido'
            fullWidth
            autoComplete='lname'
            value={lastName}
            onChange={handleChange('lastName')}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={address1.length !== 0 && !isValidAddress(address1)}
            required
            label='Morada'
            fullWidth
            autoComplete='billing address-line1'
            value={address1}
            onChange={handleChange('address1')}
            helperText='Nome da rua, praça, avenida, entre outros'
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={address2.length !== 0 && !isValidAddress(address2)}
            label='Morada (segunda linha)'
            fullWidth
            autoComplete='billing address-line2'
            value={address2}
            onChange={handleChange('address2')}
            helperText='Número da porta, moradia, andar'
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            error={city.length !== 0 && !isValidCity}
            required
            label='Localidade'
            fullWidth
            autoComplete='billing address-level2'
            value={city}
            onChange={handleChange('city')}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {/* TODO auto "-" symbol */}
          <TextField
            error={postalCode.length !== 0 && !isValidPostalCode}
            required
            label='Código Postal'
            fullWidth
            autoComplete='billing postal-code'
            value={postalCode}
            onChange={handleChange('postalCode')}
            disabled={disabled}
            helperText='No formato XXXX-XXX'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            required
            label='Country'
            fullWidth
            autoComplete='billing country'
            value='Portugal'
            disabled
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};

CheckoutAddress.propTypes = {
  value: PropTypes.instanceOf(Map).isRequired,
  setValue: PropTypes.func.isRequired,
  setReady: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

CheckoutAddress.defaultProps = {
  disabled: false,
};

export default CheckoutAddress;
