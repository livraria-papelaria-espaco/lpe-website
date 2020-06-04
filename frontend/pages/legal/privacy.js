import { useQuery } from '@apollo/react-hooks';
import { Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import ErrorPage from 'next/error';
import PropTypes from 'prop-types';
import React from 'react';
import Layout from '~/components/Layout';
import Markdown from '~/components/text/Markdown';
import { fetchAPI } from '~/lib/graphql';

const PRIVACY_QUERY = gql`
  query PRIVACY_QUERY {
    privacyPolicy {
      privacyPolicy
    }
  }
`;

const PrivacyPolicy = ({ defaultData }) => {
  const { data, loading, error } = useQuery(PRIVACY_QUERY);

  if (!defaultData && error) return <ErrorPage statusCode={500} />;
  if (!defaultData && loading) return null;

  const content = data ? data.privacyPolicy.privacyPolicy : defaultData;

  return (
    <Layout title='Política de Privacidade'>
      <Typography variant='h3' component='h1'>
        Política de Privacidade
      </Typography>
      <Markdown>{content}</Markdown>
    </Layout>
  );
};

PrivacyPolicy.propTypes = {
  defaultData: PropTypes.string,
};

PrivacyPolicy.defaultProps = {
  defaultData: '',
};

export const getStaticProps = async () => {
  const data = await fetchAPI(PRIVACY_QUERY);
  return {
    props: {
      unstable_revalidate: 3600, // 1 hour
      defaultData: data.privacyPolicy.privacyPolicy,
    },
  };
};

export default PrivacyPolicy;
