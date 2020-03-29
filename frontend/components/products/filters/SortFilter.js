import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useProductFilters } from '~/hooks/useProductFilters';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const SortFilter = () => {
  const classes = useStyles();
  const { sort, setSort } = useProductFilters();

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id='sort-by-filter-label'>Ordernar por</InputLabel>
      <Select labelId='sort-by-filter-label' value={sort} onChange={handleChange}>
        <MenuItem value='updatedAt:desc'>Relevância</MenuItem>
        <MenuItem value='name:asc'>Nome (A-Z)</MenuItem>
        <MenuItem value='name:desc'>Nome (Z-A)</MenuItem>
        <MenuItem value='price:asc'>Mais barato</MenuItem>
        <MenuItem value='price:desc'>Mais caro</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortFilter;
