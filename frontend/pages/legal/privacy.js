import { useQuery } from '@apollo/react-hooks';
import { Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import ErrorPage from 'next/error';
import React from 'react';
import Layout from '~/components/Layout';
import Markdown from '~/components/text/Markdown';

const PrivacyPolicy = () => {
  const { data, loading, error } = useQuery(TOS_QUERY);

  if (error) return <ErrorPage statusCode={500} />;
  if (loading) return null;

  return (
    <Layout title='Política de Privacidade'>
      <Typography variant='h3' component='h1'>
        Política de Privacidade
      </Typography>
      <Markdown children={data.privacyPolicy.privacyPolicy} />
    </Layout>
  );
};

const TOS_QUERY = gql`
  query TOS_QUERY {
    privacyPolicy {
      privacyPolicy
    }
  }
`;

export default PrivacyPolicy;
