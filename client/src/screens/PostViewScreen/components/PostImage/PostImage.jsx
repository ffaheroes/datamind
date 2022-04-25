import React from 'react';
import PropTypes from 'prop-types';

import styles from './PostImage.module.scss';

const PostImage = ({ post }) => (
  <figure className={styles['post-image']}>
    <picture>
      <img src={`${post.imgDescriptor}`} />
    </picture>
  </figure>
);

PostImage.propTypes = {
  post: PropTypes.object.isRequired,
};

export default PostImage;
