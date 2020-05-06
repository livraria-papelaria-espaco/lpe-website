import { Button, Container, makeStyles, Paper, Typography } from '@material-ui/core';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import Layout from '~/components/Layout';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(4),
    width: '100%',
    textAlign: 'center',
  },
  backContainer: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
  },
}));

const OtherErrorPage = ({ errorCode, errorMessage, title }) => {
  const classes = useStyles();
  return (
    <Layout title={title} hideNavbar hideFooter colorBackground>
      <Container maxWidth='sm' className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant='h1'>{errorCode}</Typography>
          <Typography variant='h6' component='p'>
            <strong>{errorMessage}</strong>
          </Typography>
          <div className={classes.backContainer}>
            <Link href='/' passHref>
              <Button variant='contained' color='primary'>
                <strong>Regressar à página principal</strong>
              </Button>
            </Link>
          </div>
        </Paper>
      </Container>
    </Layout>
  );
};

OtherErrorPage.propTypes = {
  errorCode: PropTypes.node.isRequired,
  errorMessage: PropTypes.string,
  title: PropTypes.string,
};

OtherErrorPage.defaultProps = {
  errorMessage: 'Ocorreu um erro',
  title: 'Erro',
};

export default OtherErrorPage;
