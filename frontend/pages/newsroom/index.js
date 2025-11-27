import { useQuery } from '@apollo/client';
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

const NewsroomPage = ({ defaultData }) => {
  const { data, loading, error } = useQuery(NEWSROOM_QUERY);

  if (!defaultData && error) return <ErrorPage statusCode={500} />;
  if (!defaultData && loading) return null;

  const content = data ? data.newsrooms : defaultData;

  return (
    <Layout title='Agenda de Eventos'>
      <Typography variant='h1'>Agenda de Eventos</Typography>
      {content.length === 0 && (
        <Typography variant='body1' color='textSecondary'>
          Não existem eventos neste momento
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

NewsroomPage.propTypes = {
  defaultData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string, // MongoDB ID
      title: PropTypes.string,
      content: PropTypes.string,
      createdAt: PropTypes.string, // Date
    })
  ),
};

NewsroomPage.defaultProps = {
  defaultData: [{ id: 'error', title: '', content: '', createdAt: '0' }],
};

export const getStaticProps = async () => {
  const data = await fetchAPI(NEWSROOM_QUERY);
  return {
    props: {
      revalidate: 300, // 5 min
      defaultData: data.newsrooms,
    },
  };
};

export default NewsroomPage;
