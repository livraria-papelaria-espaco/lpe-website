import 'isomorphic-unfetch';
import getConfig from 'next/config';
import { print } from 'graphql/language/printer';

const { publicRuntimeConfig } = getConfig();
const API_URL = (publicRuntimeConfig.apiUrl || 'http://localhost:3337') + '/graphql';

export async function fetchAPI(query, { variables } = {}) {
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
}
