import { Breadcrumbs, Link as MUILink } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';

const CategoryBreadcrumbs = ({ name, slug, ...props }) => {
  //TODO fetch parent categories
  return (
    <Breadcrumbs aria-label='breadcrumb' {...props}>
      <Link href='/category/[category]' as={`/category/${slug}`} passHref>
        <MUILink color='inherit'>{name}</MUILink>
      </Link>
    </Breadcrumbs>
  );
};

export default CategoryBreadcrumbs;
