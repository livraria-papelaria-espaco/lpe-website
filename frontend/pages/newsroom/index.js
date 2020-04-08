import { useQuery } from '@apollo/react-hooks';
import { Divider, Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import ErrorPage from 'next/error';
import PropTypes from 'prop-types';
import React from 'react';
import Layout from '~/components/Layout';
import NewsArticle from '~/components/newsroom/NewsArticle';
import { fetchAPI } from '~/lib/graphql';

const NEWSROOM_QUERY = gql`
  query NEWSROOM_QUERY {
    newsrooms(sort: "createdAt:desc") {
      id
      title
      content
      createdAt
    }
  }
`;

const PrivacyPolicy = ({ defaultData }) => {
  const { data, loading, error } = useQuery(NEWSROOM_QUERY);

  if (!defaultData && error) return <ErrorPage statusCode={500} />;
  if (!defaultData && loading) return null;

  const content = data ? data.newsrooms : defaultData;

  return (
    <Layout title='Destaques'>
      <Typography variant='h1'>Destaques</Typography>
      {content.length === 0 && (
        <Typography variant='body1' color='textSecondary'>
          Não existem destaques neste momento
        </Typography>
      )}
      {content.map(({ id, content: markdown, title, createdAt }, i) => (
        <div key={id}>
          {i > 0 && <Divider />}
          <NewsArticle content={markdown} title={title} date={createdAt} />
        </div>
      ))}
    </Layout>
  );
};

PrivacyPolicy.propTypes = {
  defaultData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string, // MongoDB ID
      title: PropTypes.string,
      content: PropTypes.string,
      createdAt: PropTypes.string, // Date
    })
  ),
};

PrivacyPolicy.defaultProps = {
  defaultData: [{ id: 'error', title: '', content: '', createdAt: '0' }],
};

export const getStaticProps = async () => {
  const data = await fetchAPI(NEWSROOM_QUERY);
  return {
    props: {
      defaultData: data.newsrooms,
    },
  };
};

export default PrivacyPolicy;
