import { useQuery } from '@apollo/react-hooks';
import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import AddToCart from '~/components/cart/AddToCart';
import CategoryBreadcrumbs from '~/components/categories/CategoryBreadcrumbs';
import Layout from '~/components/Layout';
import ProductImageCarousel from '~/components/products/ProductImageCarousel';
import StockBadge from '~/components/products/StockBadge';
import Markdown from '~/components/text/Markdown';
import LoadingPage from '~/components/utils/LoadingPage';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
  grid: {
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(2),
  },
  breadcrumbs: {
    paddingBottom: theme.spacing(1),
  },
}));

const GET_PRODUCT_INFO = gql`
  query GET_PRODUCT_BY_SLUG($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      description
      shortDescription
      images {
        url
        id
      }
      price
      reference
      type
      bookInfo {
        author
        edition
        publisher
      }
      category {
        slug
        name
      }
      stockStatus
    }
  }
`;

const Product = () => {
  const classes = useStyles();
  const router = useRouter();
  const { slug } = router.query;

  const { loading, error, data } = useQuery(GET_PRODUCT_INFO, {
    variables: { slug },
  });

  if (error) return <ErrorPage statusCode={500} />;
  if (loading)
    return (
      <Layout>
        <LoadingPage />
      </Layout>
    );

  const product = data.productBySlug;

  if (!product) return <ErrorPage statusCode={404} />;

  const hasImage = product.images && product.images.length > 0;

  return (
    <Layout title={product.name}>
      <Paper className={classes.paper}>
        {product.category && (
          <CategoryBreadcrumbs
            name={product.category.name}
            slug={product.category.slug}
            className={classes.breadcrumbs}
          />
        )}
        <Typography variant='h2' component='h1'>
          {product.name}
        </Typography>
        {product.type === 'Livro' && product.bookInfo && product.bookInfo.author && (
          <Typography gutterBottom variant='h5' component='h2' color='textSecondary'>
            {product.bookInfo.author}
          </Typography>
        )}
        <Grid container spacing={3} alignItems='stretch' className={classes.grid}>
          {hasImage && (
            <Grid item sm={12} md={6}>
              <ProductImageCarousel images={product.images} />
            </Grid>
          )}
          <Grid item sm={12} md={hasImage ? 6 : 12}>
            <Typography variant='h4' component='p' color='secondary'>
              <strong>{product.price.toFixed(2)}€</strong>
            </Typography>
            <StockBadge
              stock={product.stockStatus}
              component={Typography}
              variant='h6'
              gutterBottom
            />
            <Typography variant='body1' gutterBottom>
              {product.shortDescription}
            </Typography>
            {product.type === 'Livro' && product.bookInfo && (
              <>
                <Typography variant='body2' component='p'>
                  Edição: {product.bookInfo.edition}
                </Typography>
                <Typography variant='body2' component='p'>
                  Editor: {product.bookInfo.publisher}
                </Typography>
              </>
            )}
            <Typography gutterBottom variant='caption' component='p'>
              {`${product.type === 'Livro' ? 'ISBN' : 'Ref'}: ${product.reference}`}
            </Typography>
            <AddToCart
              disabled={product.stockStatus === 'UNAVAILABLE'}
              item={{ id: product.id, name: product.name, price: product.price }}
            />
          </Grid>
        </Grid>
        <Markdown>{product.description}</Markdown>
      </Paper>
    </Layout>
  );
};

export default Product;
