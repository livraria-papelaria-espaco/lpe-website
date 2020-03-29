import {
  Collapse,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { reducer } from './reducer';

const useStyles = makeStyles((theme) => ({
  indent: {
    paddingLeft: (props) => theme.spacing(2 + 2 * props.indent),
  },
}));

const CategoryItem = ({ indent, defaultOpen, name, slug, subcategories }) => {
  const classes = useStyles({ indent });
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);

  const toggleOpen = () => setOpen((v) => !v);

  const expandable = subcategories.length > 0;
  const categoriesMap = reducer(subcategories, router);

  return (
    <>
      <Link href='/category/[category]' as={`/category/${slug}`}>
        <ListItem button className={classes.indent} selected={router.query.category === slug}>
          <ListItemText primary={name} />
          {expandable && (
            <ListItemSecondaryAction>
              <IconButton aria-label='expand' onClick={toggleOpen}>
                {open ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      </Link>
      {expandable && (
        <Collapse in={open} timeout='auto' unmountOnExit>
          {Object.values(categoriesMap)
            .sort((a, b) => a.order - b.order)
            .map((v) => (
              <CategoryItem
                key={v.slug}
                indent={indent + 1}
                defaultOpen={v.open}
                name={v.name}
                slug={v.slug}
                subcategories={v.children}
              />
            ))}
        </Collapse>
      )}
    </>
  );
};

CategoryItem.propTypes = {
  indent: PropTypes.number,
  defaultOpen: PropTypes.bool,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  subcategories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      children: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

CategoryItem.defaultProps = {
  indent: 0,
  defaultOpen: false,
  subcategories: [],
};

export default CategoryItem;
