import { Link as MUILink } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/ArrowBackRounded';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  backContainer: {
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const BackArrow = ({ link, text }) => {
  const classes = useStyles();

  return (
    <div className={classes.backContainer}>
      <Link href={link} passHref>
        <MUILink className={classes.backLink} underline='none'>
          <BackIcon />
          <strong>{text}</strong>
        </MUILink>
      </Link>
    </div>
  );
};

BackArrow.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string,
};

BackArrow.defaultProps = {
  text: 'Voltar',
};

export default BackArrow;
