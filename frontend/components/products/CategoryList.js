import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { Link as MUILink } from '@material-ui/core';

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

export default CategoryList;
