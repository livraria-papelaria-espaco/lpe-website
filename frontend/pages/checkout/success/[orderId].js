import { Container, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import React from 'react';
import LogoSvg from '~/assets/logo.svg';
import Layout from '~/components/Layout';
import OrderSummary from '~/components/order/OrderSummary';
import BackArrow from '~/components/utils/BackArrow';
import Emoji from '~/components/utils/Emoji';
import { useAuth } from '~/hooks/useAuth';
import { useCart } from '~/hooks/useCart';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  paper: {
    margin: `${theme.spacing(3)}px 0px`,
    padding: theme.spacing(3),
  },
  titleContainer: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  logo: {
    fill: theme.palette.primary.main,
    maxWidth: 150,
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
}));

const OrderSucessful = () => {
  useAuth({ secure: true });
  const classes = useStyles();
  const { dispatch } = useCart();
  const router = useRouter();
  const { orderId } = router.query;

  React.useEffect(() => {
    dispatch({ type: 'RESET_CART' });
  }, []);

  if (!orderId) return null;

  return (
    <Layout title='Encomenda finializada com sucesso' hideNavbar hideFooter colorBackground>
      <Container className={classes.root}>
        <Paper className={classes.paper}>
          <BackArrow link='/' text='Voltar para a página inicial' />
          <div className={classes.titleContainer}>
            <LogoSvg className={classes.logo} />
            <Typography variant='h5' component='h2'>
              Obrigado por escolher a Livraria e Papelaria Espaço
            </Typography>
            <Typography variant='h3' component='h1'>
              Encomenda concluída! <Emoji symbol='🎉' />
            </Typography>
          </div>
          <OrderSummary id={orderId} />
        </Paper>
      </Container>
    </Layout>
  );
};

export default OrderSucessful;
