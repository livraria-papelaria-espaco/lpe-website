import { print } from 'graphql/language/printer';
import 'isomorphic-unfetch';

const API_URL = `${process.env.apiUrl || 'http://localhost:3337'}`;

export const fetchAPI = async (query, { variables } = {}) => {
  const res = await fetch(`${API_URL}/graphql`, {
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

export const fetchREST = async (url, { query, ...options }) => {
  const queryString = query
    ? `?${Object.keys(query)
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(query[k] || '')}`)
        .join('&')}`
    : ``;
  const res = await fetch(`${API_URL}${url}${queryString}`, options);
  const json = await res.json();
  if (json.statusCode && json.statusCode >= 400) {
    console.error(json);
    throw new Error('Failed to fetch API');
  }
  return json;
};

export default fetchAPI;
