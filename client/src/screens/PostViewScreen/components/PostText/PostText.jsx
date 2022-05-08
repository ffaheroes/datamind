import React from 'react';
import postTextStyles from './PostText.module.scss';
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from "../../../../components/shared/Editor";

const ReactEditorJS = createReactEditorJS()

const PostText = ({ post }) => (

  <div className={postTextStyles['post-text']}>
      <div>
                <ReactEditorJS
                  defaultValue={post.contentMarkup}
                  tools={EDITOR_JS_TOOLS}
                  readOnly={true}
                />
      </div>

  </div>
);



export default PostText;

/* eslint max-len: off */
/* eslint react/no-unescaped-entities: off */
/* eslint react/no-danger: off */
