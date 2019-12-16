import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import gql from "graphql-tag";
import Link from "next/link";
import { graphql } from "react-apollo";

const useStyles = makeStyles({
  card: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
});

const ProductList = (
  { data: { loading, error, products } /*, search*/ },
  req
) => {
  const classes = useStyles();

  if (error) return "Error loading products";
  //if restaurants are returned from the GraphQL query, run the filter query
  //and set equal to variable restaurantSearch

  if (products && products.length) {
    //searchQuery
    const searchQuery = products; /*.filter(query =>
      query.name.toLowerCase().includes(search)
    )*/
    if (searchQuery.length != 0) {
      return (
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={3}
        >
          {searchQuery.map(res => (
            <Grid item xs={6} md={4} lg={3} key={res._id}>
              <Card className={classes.card}>
                <Link
                  as={`/restaurants/${res._id}`}
                  href={`/restaurants?id=${res._id}`}
                >
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={`http://localhost:3337${res.images[0].url}`}
                      title={res.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {res.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {res.short_description}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {res.reference}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {`${res.price}€`}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    } else {
      return <h1>No Products Found</h1>;
    }
  }
  return <h1>Loading</h1>;
};

const query = gql`
  {
    products {
      name
      short_description
      images(limit: 1) {
        url
      }
      price
      reference
      _id
    }
  }
`;
ProductList.getInitialProps = async ({ req }) => {
  const res = await fetch("https://api.github.com/repos/zeit/next.js");
  const json = await res.json();
  return { stars: json.stargazers_count };
};
// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (ProductList)
export default graphql(query, {
  props: ({ data }) => ({
    data
  })
})(ProductList);
