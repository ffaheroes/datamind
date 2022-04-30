import React from 'react';
import PropTypes from 'prop-types';

import styles from './InputFields.module.scss';

const InputFields = ({ inputData, onInputChange, onCheckboxChange }) => {
  const { title, subTitle, imgDescriptor} = inputData;

  return (
    <div className={styles['input-fields']}>
      <div>
        <input type="text" className={styles['img-url']} name="imgDescriptor" placeholder="Image descriptor for url" value={imgDescriptor} onChange={onInputChange} />
      </div>
      <div>
        <input type="text" className={styles.title} name="title" placeholder="Title" value={title} onChange={onInputChange} />
      </div>
      <div>
        <input type="text" className={styles.subtitle} name="subTitle" placeholder="Subtitle" value={subTitle} onChange={onInputChange} />
      </div>
    </div>
  );
};

export default InputFields;

/* eslint object-curly-newline: off */
/* eslint jsx-a11y/label-has-for: off */
