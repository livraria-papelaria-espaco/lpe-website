import { useQuery } from '@apollo/react-hooks';
import { List } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import React from 'react';
import ErrorText from '../utils/ErrorText';
import CategoryItem from './CategoryItem';
import { reducer } from './reducer';

const GET_CATEGORIES = gql`
  query GET_CATEGORIES {
    categories {
      name
      slug
      path
      order
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  skeleton: {
    padding: theme.spacing(2),
  },
}));

const CategoryList = () => {
  const classes = useStyles();
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_CATEGORIES, { context: { important: true } });
  if (loading)
    return (
      <div className={classes.skeleton}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  if (error || !data.categories) return <ErrorText error={error} />;

  // Category path is ,slug-1,slug-2,
  // So we split it and remove both ends of the array
  const categories = data.categories.map((v) => ({ ...v, path: v.path.split(',').slice(1, -1) }));
  const categoriesMap = reducer(categories, router);

  return (
    <List component='nav'>
      {Object.values(categoriesMap)
        .sort((a, b) => a.order - b.order)
        .map((v) => (
          <CategoryItem
            key={v.slug}
            defaultOpen={v.open}
            name={v.name}
            slug={v.slug}
            subcategories={v.children}
          />
        ))}
    </List>
  );
};

export default CategoryList;
