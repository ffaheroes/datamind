import React from 'react';
import PropTypes from 'prop-types';
import styles from './PostHeader.module.scss';

const PostHeader = ({ post, author }) => (
  <header className={styles['post-header']}>
    <div className={styles['post-text']}>
        <div className={styles['post-title']}>{post.title} </div>
        <div className={styles['post-subtitle']}>{post.subTitle} </div>
    </div>
{/* 
    <span className={styles['post-profile']}>
    <a className="avatar avatar--big avatar--circled" href="https://blog.kentcdodds.com/@kentcdodds" target="_blank" rel="noopener noreferrer">
      <img src={author.avatarUrl} />
    </a>
    <div className={styles.text}>
      <div className={styles.title}>
        <a href="https://blog.kentcdodds.com/@kentcdodds" target="_blank" rel="noopener noreferrer">
          {author.username}
        </a>
        <button className={`btn btn--smallest ${styles.follow}`}>Follow</button>
      </div>
      <div className={styles.descr}>{author.bio}</div>
      <div className={styles.meta}>
        {post.date} · {post.readTimeEstimate}
      </div>
    </div>
    </span> */}


  </header>
);

PostHeader.propTypes = {
  post: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired,
};

export default PostHeader;
