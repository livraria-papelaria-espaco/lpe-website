import { Slider } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const valuetext = (value) => `${value} €`;

const PriceFilter = ({ setValue }) => {
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <Slider
      step={5}
      defaultValue={process.env.filters.priceRange}
      onChangeCommitted={handleChange}
      valueLabelDisplay='auto'
      valueLabelFormat={valuetext}
      aria-labelledby='range-slider'
      getAriaValueText={valuetext}
    />
  );
};

PriceFilter.propTypes = {
  setValue: PropTypes.func.isRequired,
};

export default PriceFilter;
