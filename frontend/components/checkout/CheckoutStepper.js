import { Button, Collapse, Paper, Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fromJS } from 'immutable';
import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import CheckoutClientData from './CheckoutClientData';
import CheckoutItems from './CheckoutItems';
import CheckoutPaymentGateway from './CheckoutPaymentGateway';
import CheckoutShipping from './CheckoutShipping';
import CheckoutSummary from './CheckoutSummary';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  resetContainer: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
  },
}));

const initialState = fromJS({
  shippingMethod: '',
  nif: '',
  shippingAddress: {},
  billingAddress: {},
  useSameAddress: true,
  paymentGateway: '',
  mbWayPhone: '',
});

const reducer = (state, action) => {
  switch (action.type) {
    case 'setValue':
      return state.set(action.field, action.value);
    case 'setValueDeep':
      return state.setIn(action.field, action.value);
    default:
      return state;
  }
};

function getSteps() {
  return [
    {
      title: 'Resumo da Encomenda',
      component: CheckoutItems,
    },
    {
      title: 'Dados do cliente',
      component: CheckoutClientData,
    },
    {
      title: 'Envio',
      component: CheckoutShipping,
    },
    {
      title: 'Método de Pagamento',
      component: CheckoutPaymentGateway,
    },
  ];
}

const CheckoutStepper = ({ disableEuPago }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation='vertical' elevation={2} square={false}>
        {steps.map(({ title, component: Component }) => (
          <Step key={title}>
            <StepLabel>{title}</StepLabel>
            <StepContent>
              <Component state={state} dispatch={dispatch} disableEuPago={disableEuPago}>
                {(disabled) => (
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}
                      >
                        Voltar
                      </Button>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={handleNext}
                        className={classes.button}
                        disabled={disabled}
                      >
                        Próximo Passo
                      </Button>
                    </div>
                  </div>
                )}
              </Component>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      <Collapse in={activeStep === steps.length} mountOnEnter unmountOnExit>
        <Paper elevation={2} className={classes.resetContainer}>
          <CheckoutSummary state={state} goBack={handleBack} />
        </Paper>
      </Collapse>
    </div>
  );
};

CheckoutStepper.propTypes = {
  disableEuPago: PropTypes.bool,
};

CheckoutStepper.defaultProps = {
  disableEuPago: false,
};

export default CheckoutStepper;
