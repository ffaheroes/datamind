import React from 'react';
import PropTypes from 'prop-types';
import styles from './PostPreview2.module.scss';
import { Link } from 'react-router-dom';

const PostPreview2 = ({ post, author }) => (
  <header className={styles['post-header']}>
    <div className={styles['post-text']}>
      <Link to={`/blogs/${post.blogId}/posts/${post._id}`}>
        <div className={styles['post-title']}>{post.title} </div>
        <div className={styles['post-subtitle']}>{post.subTitle} </div>
      </Link>
        <span className={styles['post-profile']}>
          <a className="avatar avatar--xsmall avatar--circled" href="https://blog.kentcdodds.com/@kentcdodds" target="_blank" rel="noopener noreferrer">
            <img src={author.avatarUrl} />
          </a>
          <div className={styles.title}>
            <Link to={`/blogs/${author.username}`}>
            <div>{author.username}</div>
            </Link>
          </div>
          <div className={styles.meta}>
          · {post.date} · {post.readTimeEstimate}
          </div>
        </span>
    </div>
    <Link to={`/blogs/${post.blogId}/posts/${post._id}`}>
    <div className={styles['post-image']}>
      <picture >
        <img src={`${post.imgDescriptor}`} />
      </picture>
    </div>
    </Link>

  
      




  </header>
);

PostPreview2.propTypes = {
  post: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
};

export default PostPreview2;
