import { useQuery } from '@apollo/react-hooks';
import { Link, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import ReactMarkdown from 'markdown-to-jsx';
import { useRouter } from 'next/router';
import AddToCart from '../components/cart/AddToCart';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import defaultPage from '../hocs/defaultPage';

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

const Product = ({ loggedUser }) => {
  const router = useRouter();

  const { loading, error, data } = useQuery(GET_PRODUCT_INFO, {
    variables: { id: router.query.id },
  });

  if (error) return <Typography variant='h1'>{`An error occurred: ${error}`}</Typography>;
  if (loading) return <Typography variant='h1'>Loading</Typography>;

  const product = data.products[0];

  if (!product) return <Typography variant='h1'>404 Not found</Typography>;

  return (
    <div>
      <Navbar username={loggedUser} />
      <Layout title={product.name}>
        <Typography variant='h1'>{product.name}</Typography>
        {product.images.map((i) => (
          <img key={i.id} src={`http://localhost:3337/${i.url}`} />
        ))}
        <ReactMarkdown options={markdownOptions} children={product.description} />
        <Typography variant='h6' component='p' color='secondary'>
          {product.price.toFixed(2)}€
        </Typography>
        <Typography variant='subtitle2'>ISBN: {product.reference}</Typography>
        {product.type === 'Livro' && product.book_info && (
          <>
            <Typography variant='body1'>Autor: {product.book_info.author}</Typography>
            <Typography variant='body1'>Edição: {product.book_info.edition}</Typography>
            <Typography variant='body1'>Editor: {product.book_info.publisher}</Typography>
          </>
        )}
        {product.category && (
          <Typography variant='body1'>Categoria: {product.category.name}</Typography>
        )}
        <Typography variant='body1'>Estado: {product.stock_status}</Typography>
        <AddToCart item={{ id: product.id, name: product.name, price: product.price }} />
      </Layout>
    </div>
  );
};

const GET_PRODUCT_INFO = gql`
  query($id: ID!) {
    products(where: { slug: $id }) {
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
      book_info {
        author
        edition
        publisher
      }
      category {
        name
      }
      stock_status
    }
  }
`;

export default defaultPage(Product);
