import { Link, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'markdown-to-jsx';
import PropTypes from 'prop-types';
import React from 'react';

const styles = (theme) => ({
  listItem: {
    marginTop: theme.spacing(1),
  },
});

const markdownOptions = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h5',
      },
    },
    h2: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
    h3: { component: Typography, props: { gutterBottom: true, variant: 'subtitle1' } },
    h4: {
      component: Typography,
      props: { gutterBottom: true, variant: 'caption', paragraph: true },
    },
    p: { component: Typography, props: { paragraph: true } },
    a: { component: Link },
    li: {
      component: withStyles(styles)(({ classes, ...props }) => (
        <li className={classes.listItem}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Typography component='span' {...props} />
        </li>
      )),
    },
  },
};

const Markdown = ({ children, className }) => (
  <ReactMarkdown options={markdownOptions} className={className}>
    {children}
  </ReactMarkdown>
);

Markdown.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Markdown.defaultProps = {
  className: '',
};

export default Markdown;
