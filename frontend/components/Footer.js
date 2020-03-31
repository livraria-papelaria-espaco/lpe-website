import { Container, Grid, Link as MUILink, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    background: `linear-gradient(0deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 40%, ${theme.palette.primary.light} 100%)`,
    color: theme.palette.primary.contrastText,
  },
  mainContent: {
    padding: `${theme.spacing(3)}px 0px`,
  },
  copyright: {
    color: theme.palette.getContrastText(theme.palette.primary.dark),
    padding: `${theme.spacing(1)}px 0px`,
  },
}));
const Footer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.mainContent}>
        <Grid container component={Container} fixed>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5'>Informações</Typography>
            <FooterLink href='/legal/tos' text='Termos e Condições' />
            <FooterLink href='/legal/privacy' text='Política de Privacidade' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5'>A nossa loja</Typography>
            <Typography variant='body1'>
              <MUILink
                href={process.env.footer.gmapsLink}
                target='_blank'
                rel='noopenner noreferrer'
                color='inherit'
              >
                {process.env.footer.address1}
                <br />
                {process.env.footer.address2}
              </MUILink>
            </Typography>
            <Typography variant='body1'>
              Telefone:{' '}
              <MUILink href={`tel:${process.env.footer.phone}`} color='inherit'>
                {process.env.footer.phone}
              </MUILink>
            </Typography>
            <Typography variant='body1'>
              Email:{' '}
              <MUILink href={`mailto:${process.env.footer.email}`} color='inherit'>
                {process.env.footer.email}
              </MUILink>
            </Typography>
          </Grid>
        </Grid>
      </div>
      <div className={classes.copyright}>
        <Grid container component={Container} fixed>
          <Grid item xs={12} sm={6}>
            <Typography variant='body2'>{`\u00A9 ${new Date().getFullYear()} ${
              process.env.siteTitle
            }`}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='body2'>
              {`Website por `}
              <MUILink
                href='https://diogotc.com'
                target='_blank'
                color='inherit'
                rel='noopener noreferrer'
              >
                Diogo Correia
              </MUILink>
            </Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const FooterLink = ({ href, text }) => (
  <Typography variant='body1'>
    <Link href={href} passHref>
      <MUILink color='inherit'>{text}</MUILink>
    </Link>
  </Typography>
);

FooterLink.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Footer;
