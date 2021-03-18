import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import AddToCart from '~/components/cart/AddToCart';
import CategoryBreadcrumbs from '~/components/categories/CategoryBreadcrumbs';
import Error404 from '~/components/error/404';
import Layout from '~/components/Layout';
import ProductImageCarousel from '~/components/products/ProductImageCarousel';
import ProductSEO from '~/components/products/ProductSEO';
import StockBadge from '~/components/products/StockBadge';
import StockLoader from '~/components/products/StockLoader';
import Markdown from '~/components/text/Markdown';
import LoadingPage from '~/components/utils/LoadingPage';
import { fetchAPI } from '~/lib/graphql';

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
  discountOld: {
    color: theme.palette.error.dark,
    textDecoration: 'line-through',
  },
  discountAmount: {
    paddingLeft: theme.spacing(1),
  },
}));

const GET_PRODUCT_INFO = gql`
  query GET_PRODUCT_BY_SLUG($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      slug
      description
      shortDescription
      images {
        url
        id
      }
      price
      reference
      type
      bookAuthor
      bookEdition
      bookPublisher
      bookPages
      publishedDate
      language
      category {
        slug
        name
        path
      }
    }
    globalDiscount {
      discounts {
        __typename
        ... on ComponentDiscountsProductTypeDiscount {
          percentage
          type
        }
      }
    }
  }
`;

const NEW_PRODUCTS_QUERY = gql`
  query NEW_PRODUCTS_QUERY {
    newProducts {
      slug
    }
  }
`;

const Product = ({ defaultData }) => {
  const classes = useStyles();
  const router = useRouter();
  const { slug } = router.query;

  if (router.isFallback)
    return (
      <Layout>
        <LoadingPage />
      </Layout>
    );

  const product = defaultData;

  if (!product) return <Error404 />;

  const hasImage = product.images && product.images.length > 0;

  return (
    <Layout title={product.name} showStoreNav>
      <ProductSEO product={product} />
      <GAProduct
        id={product.id}
        name={product.name}
        price={product.price}
        category={product.category ? product.category.name : undefined}
      />
      <Paper className={classes.paper}>
        {product.category && (
          <CategoryBreadcrumbs
            name={product.category.name}
            slug={product.category.slug}
            path={product.category.path}
            className={classes.breadcrumbs}
          />
        )}
        <Typography variant='h2' component='h1'>
          {product.name}
        </Typography>
        {product.bookAuthor && (
          <Typography gutterBottom variant='h5' component='h2' color='textSecondary'>
            {product.bookAuthor}
          </Typography>
        )}
        <Grid container spacing={3} alignItems='stretch' className={classes.grid}>
          {hasImage && (
            <Grid item sm={12} md={6}>
              <ProductImageCarousel images={product.images} />
            </Grid>
          )}
          <Grid item sm={12} md={hasImage ? 6 : 12}>
            {product.discountPercent > 0 && (
              <Typography variant='h5' component='p'>
                <strong className={classes.discountOld}>{`${product.price.toFixed(2)}€ `}</strong>
                <strong
                  className={classes.discountAmount}
                >{` -${product.discountPercent}%`}</strong>
              </Typography>
            )}
            <Typography variant='h4' component='p' color='secondary'>
              <strong>
                {(product.price * ((100 - (product.discountPercent || 0)) / 100)).toFixed(2)}€
              </strong>
            </Typography>
            <StockLoader product={slug}>
              {(stockStatus) => (
                <>
                  <StockBadge
                    stock={stockStatus}
                    component={Typography}
                    variant='h6'
                    gutterBottom
                  />
                  <Typography variant='body1' gutterBottom>
                    {product.shortDescription || ''}
                  </Typography>
                  {product.bookEdition && (
                    <Typography variant='body2' component='p'>
                      Edição: {product.bookEdition}
                    </Typography>
                  )}
                  {product.bookPublisher && (
                    <Typography variant='body2' component='p'>
                      Editor: {product.bookPublisher}
                    </Typography>
                  )}
                  {product.bookPages && (
                    <Typography variant='body2' component='p'>
                      Páginas: {product.bookPages}
                    </Typography>
                  )}
                  {product.publishedDate && (
                    <Typography variant='body2' component='p'>
                      {product.type === 'Livro' ? 'Data de Publicação' : 'Data de Lançamento'}:{' '}
                      {product.publishedDate}
                    </Typography>
                  )}
                  {product.language && (
                    <Typography variant='body2' component='p'>
                      Idioma: {product.language}
                    </Typography>
                  )}
                  <Typography gutterBottom variant='caption' component='p'>
                    {`${product.type === 'Livro' ? 'ISBN' : 'Ref'}: ${product.reference}`}
                  </Typography>
                  <AddToCart
                    disabled={stockStatus === 'UNAVAILABLE'}
                    item={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      discountPercent: product.discountPercent,
                    }}
                  />
                </>
              )}
            </StockLoader>
          </Grid>
        </Grid>
        <Markdown>{product.description || ''}</Markdown>
      </Paper>
    </Layout>
  );
};

Product.propTypes = {
  defaultData: PropTypes.shape({
    id: PropTypes.string.isRequired, // Mongodb ID
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    description: PropTypes.string,
    shortDescription: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
      })
    ),
    price: PropTypes.number.isRequired,
    reference: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    bookAuthor: PropTypes.string,
    bookEdition: PropTypes.string,
    bookPublisher: PropTypes.string,
    bookPages: PropTypes.number,
    publishedDate: PropTypes.string,
    language: PropTypes.string,
    category: PropTypes.shape({
      slug: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
    discountPercent: PropTypes.number,
  }),
};

Product.defaultProps = {
  defaultData: undefined,
};

export const getStaticPaths = async () => {
  const data = await fetchAPI(NEW_PRODUCTS_QUERY);

  return {
    paths: (data.newProducts || []).map((v) => ({ params: { slug: v.slug } })),
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const data = await fetchAPI(GET_PRODUCT_INFO, {
    variables: { slug: context.params.slug },
  });

  const handleProduct = (product) => ({
    ...product,
    discountPercent: Math.max(
      0,
      ...data.globalDiscount.discounts.map((discount) => {
        // eslint-disable-next-line no-underscore-dangle
        if (discount.__typename === 'ComponentDiscountsProductTypeDiscount')
          return discount.type === product.type ? discount.percentage : 0;
        return 0;
      })
    ),
  });

  const defaultData = !data.productBySlug ? null : handleProduct(data.productBySlug);

  return {
    revalidate: 300, // 5 min
    props: { defaultData },
  };
};

const GAProduct = ({ id, name, price, category }) => {
  useEffect(() => {
    if (window && window.gtag) {
      window.gtag('event', 'view_item', {
        items: [{ id, name, price, category }],
      });
    }
  }, []);

  return null;
};

export default Product;
