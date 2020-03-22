import React from 'react';
import { FormattedMessage } from 'react-intl';
import getTrad from '../../utils/getTrad';

const SectionTitle = ({ children, title }) => {
  return (
    <>
      <h2>
        <FormattedMessage id={getTrad(`OrderPage.content.section.${title}`)} />
      </h2>
      <div className='row'>{children}</div>
    </>
  );
};

export default SectionTitle;
