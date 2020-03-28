import { useQuery } from '@apollo/react-hooks';
import { Link as MUILink } from '@material-ui/core';
import gql from 'graphql-tag';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const GET_CATEGORIES = gql`
  query GET_CATEGORIES($where: JSON!) {
    categories(where: $where) {
      name
      slug
      categories {
        id
        name
        slug
      }
    }
  }
`;

const CategoryList = ({ parent }) => {
  const { data, loading, error } = useQuery(GET_CATEGORIES, {
    variables: { where: parent ? { parent } : { parent_null: true } },
  });
  if (loading) return <p>Loading</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  return (
    <ul>
      {data.categories.map((category) => (
        <div key={category.slug}>
          <Link href='/category/[category]' as={`/category/${category.slug}`} passHref>
            <MUILink component='li'>{category.name}</MUILink>
          </Link>
          {category.categories.map((subcategory) => (
            <ul key={subcategory.id}>
              <Link href='/category/[category]' as={`/category/${subcategory.slug}`} passHref>
                <MUILink component='li'>{subcategory.name}</MUILink>
              </Link>
              <CategoryList parent={subcategory.id} />
            </ul>
          ))}
        </div>
      ))}
    </ul>
  );
};

CategoryList.propTypes = {
  parent: PropTypes.string, // MongoDB ID
};

CategoryList.defaultProps = {
  parent: null,
};

export default CategoryList;
