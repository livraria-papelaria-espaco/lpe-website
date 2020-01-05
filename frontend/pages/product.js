import gql from 'graphql-tag';
import { withRouter } from 'next/router';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
//import { withContext } from '../components/Context/AppProvider';
//import Cart from "../components/Cart/Cart";
import { Typography, Link } from '@material-ui/core';
import defaultPage from '../hocs/defaultPage';
import ReactMarkdown from 'markdown-to-jsx';
import { withStyles } from '@material-ui/core/styles';

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

const Product = ({ data: { error, products } }) => {
  if (error) return <Typography variant='h1'>{`An error occurred: ${error}`}</Typography>;
  if (!products) return <Typography variant='h1'>Loading</Typography>;

  const product = products[0];
  return (
    <div>
      <Typography variant='h1'>{product.name}</Typography>
      {product.images.map((i) => (
        <img key={i.id} src={`http://localhost:3337/${i.url}`} />
      ))}
      <ReactMarkdown options={markdownOptions} children={product.description} />
      <Typography variant='h6' component='p' color='secondary'>
        {product.price}€
      </Typography>
      <Typography variant='subtitle2'>{product.reference}</Typography>
    </div>
  );
};

const GET_PRODUCT_INFO = gql`
  query($id: ID!) {
    products(where: { slug: $id }) {
      name
      description
      images {
        url
        id
      }
      price
      reference
    }
  }
`;

export default compose(
  withRouter,
  defaultPage,
  //withContext,
  graphql(GET_PRODUCT_INFO, {
    options: (props) => ({
      variables: {
        id: props.router.query.id,
      },
    }),
    props: ({ data }) => ({ data }),
  })
)(Product);
