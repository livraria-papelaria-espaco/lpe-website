import { Slider, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const valuetext = (value) => `${value} €`;

const ProductFilterPrice = ({ value, setValue }) => {
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Typography id='range-slider' gutterBottom>
        Filtro de preço (€)
      </Typography>
      <Slider
        step={5}
        defaultValue={value}
        onChangeCommitted={handleChange}
        valueLabelDisplay='auto'
        valueLabelFormat={valuetext}
        aria-labelledby='range-slider'
        getAriaValueText={valuetext}
      />
    </div>
  );
};

ProductFilterPrice.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  setValue: PropTypes.func.isRequired,
};

ProductFilterPrice.defaultProps = {
  value: [0, 100],
};

export default ProductFilterPrice;
