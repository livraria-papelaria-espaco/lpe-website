import { Button, Fade, MobileStepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import getConfig from 'next/config';
import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect } from 'react';

const { publicRuntimeConfig } = getConfig();

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    minHeight: 400,
    display: 'flex',
    flexDirection: 'column',
  },
  stepper: {
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  imagesContainer: {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    maxHeight: '100%',
    maxWidth: '100%',
  },
}));

const ProductImageCarousel = ({ images }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const timer = useRef();
  const maxSteps = images.length;

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setInterval(() => {
      setActiveStep((currentStep) => (currentStep === maxSteps - 1 ? 0 : currentStep + 1));
    }, 5000);
  };

  const handleNext = () => {
    resetTimer();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    resetTimer();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Clear timer on unmount
  useEffect(() => {
    resetTimer();
    return () => timer.current && clearTimeout(timer.current);
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.imagesContainer}>
        {images.map((img, i) => (
          <Fade key={img.url} in={activeStep === i}>
            <img
              className={classes.image}
              key={img.url}
              src={`${publicRuntimeConfig.apiUrl}${img.url}`}
              alt={`Imagem ${i + 1} do produto`}
            />
          </Fade>
        ))}
      </div>
      {images.length > 1 && (
        <MobileStepper
          variant='dots'
          steps={maxSteps}
          position='static'
          activeStep={activeStep}
          className={classes.stepper}
          nextButton={
            <Button size='small' onClick={handleNext} disabled={activeStep === maxSteps - 1}>
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size='small' onClick={handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeft />
            </Button>
          }
        />
      )}
    </div>
  );
};

ProductImageCarousel.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
    })
  ),
};

ProductImageCarousel.defaultProps = {
  images: [],
};

export default ProductImageCarousel;
