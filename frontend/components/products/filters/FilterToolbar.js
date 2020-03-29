import { Button, Paper, Typography, Collapse } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useProductFilters } from '~/hooks/useProductFilters';
import PriceFilter from './PriceFilter';
import SortFilter from './SortFilter';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'bottom',
    marginBottom: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
  buttonText: {
    display: 'inline',
  },
  paper: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
}));

const FilterToolbar = () => {
  const classes = useStyles();
  const { priceRange, setPriceRange } = useProductFilters();
  const [showPriceRange, setShowPriceRange] = useState(false);

  const toggleShowPriceRange = () => setShowPriceRange((v) => !v);

  return (
    <div className={classes.root}>
      <div className={classes.toolbar}>
        <SortFilter />
        <Button
          variant='outlined'
          onClick={toggleShowPriceRange}
          classes={{ root: classes.button, label: classes.buttonText }}
        >
          Filtro de Preço
          <Typography
            variant='caption'
            component='p'
          >{`${priceRange[0]} € - ${priceRange[1]} €`}</Typography>
        </Button>
      </div>
      <Collapse in={showPriceRange}>
        <Paper variant='outlined' className={classes.paper}>
          <PriceFilter setValue={setPriceRange} />
        </Paper>
      </Collapse>
    </div>
  );
};

export default FilterToolbar;
