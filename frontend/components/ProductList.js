import { useQuery } from '@apollo/react-hooks';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import getConfig from 'next/config';
import Link from 'next/link';

const { publicRuntimeConfig } = getConfig();

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const ProductList = (/*{search}*/) => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(PRODUCTS_QUERY);

  if (error) return 'Error loading products';
  if (loading) return <h1>Loading</h1>;

  if (data.products && data.products.length) {
    const searchQuery =
      data.products; /*.filter(query =>
      query.name.toLowerCase().includes(search)
    )*/
    if (searchQuery.length != 0) {
      return (
        <Grid container direction='row' justify='center' alignItems='center' spacing={3}>
          {searchQuery.map((res) => (
            <Grid item xs={6} md={4} lg={3} key={res.slug}>
              <Card className={classes.card}>
                <Link as={`/product/${res.slug}`} href={`/product?id=${res.slug}`}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={`${publicRuntimeConfig.apiUrl}${res.images[0].url}`}
                      title={res.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='h2'>
                        {res.name}
                      </Typography>
                      <Typography variant='body2' color='textSecondary' component='p'>
                        {res.short_description}
                      </Typography>
                      <Typography variant='body2' component='p'>
                        {res.reference}
                      </Typography>
                      <Typography variant='body2' component='p'>
                        Estado: {res.stock_status}
                      </Typography>
                      <Typography variant='body1' color='secondary' component='p'>
                        {`${res.price.toFixed(2)}€`}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }
  }

  return <h1>No Products Found</h1>;
};

const PRODUCTS_QUERY = gql`
  {
    products {
      name
      short_description
      images(limit: 1) {
        url
      }
      price
      reference
      slug
      stock_status
    }
  }
`;
// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (ProductList)
export default ProductList;
