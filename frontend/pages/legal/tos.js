import { useQuery } from '@apollo/react-hooks';
import { Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import ErrorPage from 'next/error';
import React from 'react';
import Layout from '~/components/Layout';
import Markdown from '~/components/text/Markdown';
import { fetchAPI } from '~/lib/graphql';

const TermsOfService = ({ defaultData }) => {
  const { data, loading, error } = useQuery(TOS_QUERY);

  if (!defaultData && error) return <ErrorPage statusCode={500} />;
  if (!defaultData && loading) return null;

  const content = data ? data.termsOfService.termsOfService : defaultData;

  return (
    <Layout title='Termos de Serviço'>
      <Typography variant='h3' component='h1'>
        Termos de Serviço
      </Typography>
      <Markdown children={content} />
    </Layout>
  );
};

const TOS_QUERY = gql`
  query TOS_QUERY {
    termsOfService {
      termsOfService
    }
  }
`;

export const getStaticProps = async () => {
  const data = await fetchAPI(TOS_QUERY);
  return {
    props: {
      defaultData: data.termsOfService.termsOfService,
    },
  };
};

export default TermsOfService;
