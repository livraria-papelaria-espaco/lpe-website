import { Container, Link as MUILink, makeStyles, Paper, Typography } from '@material-ui/core';
import BackIcon from '@material-ui/icons/ArrowBackRounded';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import LogoSvg from '~/assets/logo.svg';
import Layout from '~/components/Layout';
import { useAuth } from '~/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  logo: {
    fill: theme.palette.primary.main,
    maxWidth: 200,
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
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
    textAlign: 'left',
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const AuthPageLayout = ({ title, cardTitle, children }) => {
  const classes = useStyles();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) router.replace(router.query.redirect || '/');
  }, [isAuthenticated]);

  return (
    <Layout title={title} hideNavbar hideFooter colorBackground>
      <Container maxWidth='sm' className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.backContainer}>
            <MUILink href='#' onClick={router.back} className={classes.backLink} underline='none'>
              <BackIcon />
              <strong>Voltar</strong>
            </MUILink>
          </div>
          <LogoSvg className={classes.logo} />
          <Typography variant='h4' component='h1'>
            {cardTitle}
          </Typography>
          {children}
        </Paper>
      </Container>
    </Layout>
  );
};

AuthPageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  cardTitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AuthPageLayout;
