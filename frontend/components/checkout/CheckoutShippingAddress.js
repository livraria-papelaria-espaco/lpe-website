import { FormControl, FormLabel, Grid, TextField } from '@material-ui/core';
import React from 'react';

const CheckoutShippingAddress = ({ value, setValue }) => {
  const handleChange = (key) => (event) => {
    setValue({ ...value, [key]: event.target.value });
  };

  return (
    <FormControl component='fieldset'>
      <FormLabel component='legend'>Morada de Entrega</FormLabel>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='firstName'
            name='firstName'
            label='First name'
            fullWidth
            autoComplete='fname'
            onChange={handleChange('firstName')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='lastName'
            name='lastName'
            label='Last name'
            fullWidth
            autoComplete='lname'
            onChange={handleChange('lastName')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id='address1'
            name='address1'
            label='Address line 1'
            fullWidth
            autoComplete='billing address-line1'
            onChange={handleChange('address1')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='address2'
            name='address2'
            label='Address line 2'
            fullWidth
            autoComplete='billing address-line2'
            onChange={handleChange('address2')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id='city'
            name='city'
            label='City'
            fullWidth
            autoComplete='billing address-level2'
            onChange={handleChange('city')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='zip'
            name='zip'
            label='Zip / Postal code'
            fullWidth
            autoComplete='billing postal-code'
            onChange={handleChange('postalCode')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='country'
            name='country'
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

export default CheckoutShippingAddress;
