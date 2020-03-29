import { Breadcrumbs, Link as MUILink } from '@material-ui/core';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const CategoryBreadcrumbs = ({ name, slug, className }) => {
  // TODO fetch parent categories
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Breadcrumbs aria-label='breadcrumb' className={className}>
      <Link href='/category/[category]' as={`/category/${slug}`} passHref>
        <MUILink color='inherit'>{name}</MUILink>
      </Link>
    </Breadcrumbs>
  );
};

CategoryBreadcrumbs.propTypes = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  className: PropTypes.string,
};

CategoryBreadcrumbs.defaultProps = {
  className: '',
};

export default CategoryBreadcrumbs;
