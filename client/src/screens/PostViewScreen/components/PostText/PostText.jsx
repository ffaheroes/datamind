import React from 'react';
import PropTypes from 'prop-types';
import postTextStyles from './PostText.module.scss';
import Prism from "prismjs";
import Code from '../../../../components/shared/Code';
import parse from 'html-react-parser';
import JsxParser from 'react-jsx-parser'
import Highlight from 'react-highlight'

const code = `const App = props => {
  return (
    <div>
      <h1> React App </h1>
      <div>Awesome code</div>
    </div>
  );
};
`;

const PostText = ({ post }) => (

  <div className={postTextStyles['post-text']}>
    {/* <h1 className={postTextStyles.title}>{post.title}</h1>
    <p><em>{post.subTitle}</em></p> */}
    <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html:post.contentMarkup}} />
    

    {/* {parse(post.contentMarkup)}

    <Highlight className='language-javascript'>
      {post.contentMarkup}
    </Highlight>


    <JsxParser
    components={{Code,Highlight}}
    jsx={post.contentMarkup}
  /> */}

  </div>
);



export default PostText;

/* eslint max-len: off */
/* eslint react/no-unescaped-entities: off */
/* eslint react/no-danger: off */
