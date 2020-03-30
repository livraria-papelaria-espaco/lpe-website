import { Card, CardActionArea, CardContent, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import OrdersIcon from '@material-ui/icons/ShoppingBasketRounded';
import Link from 'next/link';
import React from 'react';
import Layout from '~/components/Layout';
import { useAuth } from '~/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
  },
  icon: {
    marginRight: theme.spacing(3),
  },
  cardActionArea: {
    height: '100%',
  },
  cardContent: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const Profile = () => {
  useAuth({ secure: true });
  const classes = useStyles();

  return (
    <Layout title='Área Cliente'>
      <Typography variant='h1'>Área Cliente</Typography>
      <Grid container spacing={4} alignItems='stretch'>
        <Grid item xs={12} md={6}>
          <Link href='/dashboard/orders'>
            <Card className={classes.card} variant='outlined'>
              <CardActionArea className={classes.cardActionArea}>
                <CardContent className={classes.cardContent}>
                  <OrdersIcon fontSize='large' className={classes.icon} />
                  <div>
                    <Typography variant='h5' component='p'>
                      As suas encomendas
                    </Typography>
                    <Typography variant='h6' component='p' color='textSecondary'>
                      Siga as suas encomendas
                    </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={12} md={6}>
          <Link href='/dashboard/manage'>
            <Card className={classes.card} variant='outlined'>
              <CardActionArea className={classes.cardActionArea}>
                <CardContent className={classes.cardContent}>
                  <SettingsIcon fontSize='large' className={classes.icon} />
                  <div>
                    <Typography variant='h5' component='p'>
                      Gerir a sua conta
                    </Typography>
                    <Typography variant='h6' component='p' color='textSecondary'>
                      Alterar palavra-passe{/* TODO , moradas, etc... */}
                    </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Profile;
