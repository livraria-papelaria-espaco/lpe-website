import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Markdown from '../text/Markdown';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  markdown: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

const NewsArticle = ({ title, date, content }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant='h3' component='h2'>
        {title}
      </Typography>
      <Typography variant='subtitle2' color='textSecondary'>{`Publicado a ${new Date(
        date
      ).toLocaleDateString('pt-PT')}`}</Typography>
      <Markdown className={classes.markdown}>{content}</Markdown>
    </div>
  );
};

NewsArticle.propTypes = {
  title: PropTypes.string,
  date: PropTypes.string,
  content: PropTypes.string,
};

NewsArticle.defaultProps = {
  title: '',
  date: '',
  content: '',
};

export default NewsArticle;
