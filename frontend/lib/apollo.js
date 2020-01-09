import { HttpLink } from 'apollo-boost';
import { withData } from 'next-apollo';

const config = {
  link: new HttpLink({
    uri: 'http://localhost:3337/graphql', // Server URL (must be absolute)
  }),
};
export default withData(config);
