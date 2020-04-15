import { Container, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';
import BackgroundImg from '~/assets/background.jpg';
import Markdown from '~/components/text/Markdown';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    background: `url(${BackgroundImg}) center right no-repeat fixed padding-box content-box`,
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  paper: {
    textAlign: 'justify',
    padding: theme.spacing(2),
  },
}));

const AboutUs = ({ text }) => {
  const classes = useStyles();

  return (
    <div className={classes.root} id='about-us'>
      <Container fixed className={classes.container}>
        <Typography variant='h2' gutterBottom>
          Sobre nós
        </Typography>
        <Paper className={classes.paper}>
          <Markdown>{text}</Markdown>
        </Paper>
      </Container>
    </div>
  );
};

AboutUs.propTypes = {
  text: PropTypes.string,
};

AboutUs.defaultProps = {
  text: '',
};

export default AboutUs;
