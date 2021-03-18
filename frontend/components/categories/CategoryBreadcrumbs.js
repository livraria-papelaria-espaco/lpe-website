import { Breadcrumbs, Link as MUILink } from '@material-ui/core';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Skeleton } from '@material-ui/lab';

const CategoryBreadcrumbs = ({ name, slug, path, className }) => {
  // TODO fetch parent categories
  return (
    <Breadcrumbs aria-label='breadcrumb' className={className}>
      {path
        .split(',')
        .slice(1, -2)
        .map((v) => (
          <Link key={v} href='/category/[category]' as={`/category/${v}`} passHref>
            <BreadcrumbItem slug={v} />
          </Link>
        ))}
      <Link href='/category/[category]' as={`/category/${slug}`} passHref>
        <MUILink color='inherit'>{name}</MUILink>
      </Link>
    </Breadcrumbs>
  );
};

CategoryBreadcrumbs.propTypes = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  path: PropTypes.string,
  className: PropTypes.string,
};

CategoryBreadcrumbs.defaultProps = {
  className: '',
  path: '',
};

const GET_CATEGORY_NAME = gql`
  query GET_CATEGORY_NAME($slug: String!) {
    categoryBySlug(slug: $slug) {
      name
    }
  }
`;

const BreadcrumbItem = React.forwardRef(({ slug, href }, ref) => {
  const { data, loading, error } = useQuery(GET_CATEGORY_NAME, { variables: { slug } });

  if (loading) return <Skeleton ref={ref} width={50} />;

  const name = error ? slug : data.categoryBySlug.name;
  return (
    <MUILink href={href} ref={ref} color='inherit'>
      {name}
    </MUILink>
  );
});

BreadcrumbItem.propTypes = {
  slug: PropTypes.string.isRequired,
  href: PropTypes.string,
};

BreadcrumbItem.defaultProps = {
  href: '',
};

export default CategoryBreadcrumbs;
