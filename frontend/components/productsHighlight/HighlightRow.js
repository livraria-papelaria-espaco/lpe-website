import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import ContentRow from './ContentRow';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  titleContainer: {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 20%, ${theme.palette.primary.light} 70%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
}));

const HighlightRow = ({ row }) => {
  const classes = useStyles();

  const { title, subtitle, content = [] } = row;

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography variant='h2' component='h3'>
          {title}
        </Typography>
        <Typography variant='h4' component='h4'>
          {subtitle}
        </Typography>
      </div>
      <Paper>
        {content.map((contentRow) => (
          <ContentRow key={contentRow.id} row={contentRow} />
        ))}
      </Paper>
    </div>
  );
};

const productType = PropTypes.shape({
  id: PropTypes.string.isRequired, // MongoDB ID
  slug: PropTypes.string.isRequired,
  reference: PropTypes.string,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  shortDescription: PropTypes.string,
  type: PropTypes.oneOf(['Livro', 'Outro']).isRequired,
  bookAuthor: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
    })
  ),
});

const contentType = PropTypes.shape({
  __component: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired, // MongoDB ID
  title: PropTypes.string,
  products: PropTypes.arrayOf(productType),
  product: productType,
  description: PropTypes.string,
  badgeNumber: PropTypes.number,
  startAt: PropTypes.number,
});

HighlightRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired, // MongoDB ID
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    content: PropTypes.arrayOf(contentType),
  }).isRequired,
};

export default HighlightRow;
