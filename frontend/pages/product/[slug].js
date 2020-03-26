import { useQuery } from '@apollo/react-hooks';
import { Link, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import ReactMarkdown from 'markdown-to-jsx';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import AddToCart from '~/components/cart/AddToCart';
import Layout from '~/components/Layout';

const { publicRuntimeConfig } = getConfig();

const styles = (theme) => ({
  listItem: {
    marginTop: theme.spacing(1),
  },
});

const markdownOptions = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h5',
      },
    },
    h2: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
    h3: { component: Typography, props: { gutterBottom: true, variant: 'subtitle1' } },
    h4: {
      component: Typography,
      props: { gutterBottom: true, variant: 'caption', paragraph: true },
    },
    p: { component: Typography, props: { paragraph: true } },
    a: { component: Link },
    li: {
      component: withStyles(styles)(({ classes, ...props }) => (
        <li className={classes.listItem}>
          <Typography component='span' {...props} />
        </li>
      )),
    },
  },
};

const Product = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { loading, error, data } = useQuery(GET_PRODUCT_INFO, {
    variables: { slug },
  });

  if (error) return <Typography variant='h1'>{`An error occurred: ${error}`}</Typography>;
  if (loading) return <Typography variant='h1'>Loading</Typography>;

  const product = data.productBySlug;

  if (!product) return <Typography variant='h1'>404 Not found</Typography>;

  return (
    <Layout title={product.name}>
      <Typography variant='h1'>{product.name}</Typography>
      {product.images.map((i) => (
        <img key={i.id} src={`${publicRuntimeConfig.apiUrl}${i.url}`} />
      ))}
      <ReactMarkdown options={markdownOptions} children={product.description} />
      <Typography variant='h6' component='p' color='secondary'>
        {product.price.toFixed(2)}€
      </Typography>
      <Typography variant='subtitle2'>ISBN: {product.reference}</Typography>
      {product.type === 'Livro' && product.bookInfo && (
        <>
          <Typography variant='body1'>Autor: {product.bookInfo.author}</Typography>
          <Typography variant='body1'>Edição: {product.bookInfo.edition}</Typography>
          <Typography variant='body1'>Editor: {product.bookInfo.publisher}</Typography>
        </>
      )}
      {product.category && (
        <Typography variant='body1'>Categoria: {product.category.name}</Typography>
      )}
      <Typography variant='body1'>Estado: {product.stockStatus}</Typography>
      <AddToCart item={{ id: product.id, name: product.name, price: product.price }} />
    </Layout>
  );
};

const GET_PRODUCT_INFO = gql`
  query GET_PRODUCT_BY_SLUG($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      description
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
        name
      }
      stockStatus
    }
  }
`;

export default Product;
