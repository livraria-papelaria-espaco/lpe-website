import { useQuery } from '@apollo/react-hooks';
import { Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import ErrorPage from 'next/error';
import React from 'react';
import Layout from '~/components/Layout';
import Markdown from '~/components/text/Markdown';
import { fetchAPI } from '~/lib/graphql';

const PrivacyPolicy = ({ defaultData }) => {
  const { data, loading, error } = useQuery(TOS_QUERY);

  if (!defaultData && error) return <ErrorPage statusCode={500} />;
  if (!defaultData && loading) return null;

  const content = data ? data.privacyPolicy.privacyPolicy : defaultData;

  return (
    <Layout title='Política de Privacidade'>
      <Typography variant='h3' component='h1'>
        Política de Privacidade
      </Typography>
      <Markdown children={content} />
    </Layout>
  );
};

const PRIVACY_QUERY = gql`
  query PRIVACY_QUERY {
    privacyPolicy {
      privacyPolicy
    }
  }
`;

export const getStaticProps = async () => {
  const data = await fetchAPI(PRIVACY_QUERY);
  return {
    props: {
      defaultData: data.privacyPolicy.privacyPolicy,
    },
  };
};

export default PrivacyPolicy;
