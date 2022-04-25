import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './PostPreview.module.scss';

const PostPreview = ({ post, author }) => (
  <article className={post.isLargePreview ? `${styles.post} ${styles['post--full-width']}` : styles.post}>
    <Link className={styles.image} to={`/blogs/${post.blogId}/posts/${post._id}`}>
      <div className={styles['overlay-border']} />
      {/* <picture style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',}}> */}
      <picture >
        <img src={`${post.imgDescriptor}`} />
      </picture>
    </Link>
    <div className={styles.text}>
      <Link className={styles['text-link']} to={`/blogs/${post.blogId}/posts/${post._id}`}>
        <h3>{post.title}</h3>
        <p>{post.subTitle}</p>
      </Link>
      <div className={styles.meta}>
        <a className="avatar avatar--small avatar--circled" href="https://blog.kentcdodds.com/@kentcdodds" target="_blank" rel="noopener noreferrer">
          <img src={author.avatarUrl} />
        </a>
        <div className={styles['sub-meta']}>
          <a className={styles.author} href="https://blog.kentcdodds.com/@kentcdodds" target="_blank" rel="noopener noreferrer">
            {author.username}
          </a>
          <span className={styles.date}>{post.date}</span>
        </div>
      </div>
    </div>
  </article>
);

// PostPreview.propTypes = {
//   post: PropTypes.object.isRequired,
//   author: PropTypes.object.isRequired,
// };

export default PostPreview;
