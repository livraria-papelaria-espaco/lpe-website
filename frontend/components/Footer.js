import { Container, Link as MUILink, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import FacebookIcon from '~/assets/facebook.svg';
import InstagramIcon from '~/assets/instagram.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    background: `linear-gradient(0deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.primary.contrastText,
  },
  mainContent: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: theme.spacing(3),
  },
  section: {
    margin: theme.spacing(2),
  },
  copyright: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    color: theme.palette.getContrastText(theme.palette.primary.dark),
    padding: theme.spacing(1),
  },
  header: {
    marginTop: theme.spacing(2),
  },
  socialIcon: {
    fill: theme.palette.primary.contrastText,
    width: 24,
    verticalAlign: 'bottom',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));
const Footer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container className={classes.mainContent}>
        <div className={classes.section}>
          <Typography variant='h5' className={classes.header}>
            Informações
          </Typography>
          <FooterLink href='/legal/tos' text='Termos e Condições' />
          <FooterLink href='/legal/privacy' text='Política de Privacidade' />
          <FooterLink href='/newsroom' text='Destaques' />
          <Typography variant='body1'>
            <MUILink
              href='https://www.livroreclamacoes.pt/'
              target='_blank'
              rel='noopenner noreferrer'
              color='inherit'
            >
              Livro de Reclamações
            </MUILink>
          </Typography>
        </div>
        <div className={classes.section}>
          <Typography variant='h5' className={classes.header}>
            A nossa loja
          </Typography>
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
            {' | '}
            <MUILink href={`tel:${process.env.footer.phone2}`} color='inherit'>
              {process.env.footer.phone2}
            </MUILink>
          </Typography>
          <Typography variant='body1'>
            Email:{' '}
            <MUILink href={`mailto:${process.env.footer.email}`} color='inherit'>
              {process.env.footer.email}
            </MUILink>
          </Typography>
        </div>
        <div className={classes.section}>
          <Typography variant='h5' className={classes.header}>
            Redes sociais
          </Typography>
          <Typography variant='body1'>
            <MUILink
              href={process.env.footer.instagram}
              color='inherit'
              target='_blank'
              rel='noopener'
            >
              <InstagramIcon className={classes.socialIcon} />
              Instagram
            </MUILink>
          </Typography>
          <Typography variant='body1' gutterBottom>
            <MUILink
              href={process.env.footer.facebook}
              color='inherit'
              target='_blank'
              rel='noopener'
            >
              <FacebookIcon className={classes.socialIcon} />
              Facebook
            </MUILink>
          </Typography>
          <Typography variant='body1'>
            <MUILink
              href={process.env.footer.facebookEvents}
              color='inherit'
              target='_blank'
              rel='noopener'
            >
              Agenda de Eventos
            </MUILink>
          </Typography>
        </div>
      </Container>
      <Container className={classes.copyright}>
        <Typography variant='body2'>{`\u00A9 ${new Date().getFullYear()} ${
          process.env.siteTitle
        }`}</Typography>
        <Typography variant='body2'>
          <MUILink href='https://reli.pt' target='_blank' color='inherit' rel='noopener noreferrer'>
            Livraria Associada à Rede de Livrarias Independentes
          </MUILink>
        </Typography>
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
      </Container>
    </div>
  );
};

const FooterLink = ({ href, icon, text }) => (
  <Typography variant='body1'>
    <Link href={href} passHref>
      <MUILink color='inherit'>
        {icon} {text}
      </MUILink>
    </Link>
  </Typography>
);

FooterLink.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.node,
  text: PropTypes.node.isRequired,
};

FooterLink.defaultProps = {
  icon: undefined,
};

export default Footer;
