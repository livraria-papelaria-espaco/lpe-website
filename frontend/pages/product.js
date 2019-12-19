import gql from 'graphql-tag';
import { withRouter } from 'next/router';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
//import { withContext } from '../components/Context/AppProvider';
//import Cart from "../components/Cart/Cart";
import { Typography } from '@material-ui/core';
import defaultPage from '../hocs/defaultPage';

const Product = ({ data: { loading, error, products }, router, context }) => {
  if (error) return <Typography variant='h1'>{`An error occurred: ${error}`}</Typography>;
  if (!products) return <Typography variant='h1'>Loading</Typography>;

  const product = products[0];
  return (
    <div>
      <Typography variant='h1'>{product.name}</Typography>
      {product.images.map((i) => (
        <img key={i.id} src={`http://localhost:3337/${i.url}`} />
      ))}
      <Typography variant='body1'>{product.description}</Typography>
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
