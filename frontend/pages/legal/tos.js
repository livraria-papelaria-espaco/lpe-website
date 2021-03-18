import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import ErrorPage from 'next/error';
import PropTypes from 'prop-types';
import React from 'react';
import Layout from '~/components/Layout';
import Markdown from '~/components/text/Markdown';
import { fetchAPI } from '~/lib/graphql';

const TOS_QUERY = gql`
  query TOS_QUERY {
    termsOfService {
      termsOfService
    }
  }
`;

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
      <Markdown>{content}</Markdown>
    </Layout>
  );
};

TermsOfService.propTypes = {
  defaultData: PropTypes.string,
};

TermsOfService.defaultProps = {
  defaultData: '',
};

export const getStaticProps = async () => {
  const data = await fetchAPI(TOS_QUERY);
  return {
    props: {
      revalidate: 3600, // 1 hour
      defaultData: data.termsOfService.termsOfService,
    },
  };
};

export default TermsOfService;
