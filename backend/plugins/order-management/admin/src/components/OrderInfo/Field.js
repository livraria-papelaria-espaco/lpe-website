import React from 'react';
import { Field as StyledField, FieldTitle, FieldValue } from './Components';
import { FormattedMessage } from 'react-intl';
import getTrad from '../../utils/getTrad';

const Field = ({ title, value, assert, sm = 12, md = 6, lg = 4 }) => {
  if (assert === false) return null;

  return (
    <StyledField className={[`col-sm-${sm}`, `col-md-${md}`, `col-lg-${lg}`].join(' ')}>
      <FieldTitle>
        <FormattedMessage id={getTrad(`OrderPage.content.field.${title}`)} />
      </FieldTitle>
      <FieldValue>{value}</FieldValue>
    </StyledField>
  );
};

export default Field;
