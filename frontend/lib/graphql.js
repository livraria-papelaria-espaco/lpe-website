import { print } from 'graphql/language/printer';
import 'isomorphic-unfetch';

const API_URL = `${process.env.apiUrl || 'http://localhost:3337'}/graphql`;

export const fetchAPI = async (query, { variables } = {}) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: print(query),
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
};

export default fetchAPI;
