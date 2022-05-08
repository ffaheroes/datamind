import React, {useContext,useState} from 'react';
import Spinner from '../../components/shared/Spinner';
import { Link,useNavigate } from 'react-router-dom';
import MediumEditor from 'medium-editor';
import InputFields from './components/InputFields';
import styles from './CreateScreen.module.scss';
import postTextStyles from '../../components/shared/PostText/PostText.module.scss';
import { GlobalContext } from '../../context/Provider';
import { WithContext as ReactTags } from 'react-tag-input';
import TagStyles from './../../assets/styles/TagStyles.css'
import Switch from '@mui/material/Switch';
import { createReactEditorJS } from 'react-editor-js'

import { EDITOR_JS_TOOLS } from "../../components/shared/Editor";




const CreateScreen = () => {
  let navigate = useNavigate();
  const {authDispatch,authState} = useContext(GlobalContext);
  console.log('createscreen authstate',authState)
  
  const [state, setState] = useState({
                                        isDataLoaded: false,
                                        formData: {
                                          title: '',
                                          subTitle: '',
                                          imgDescriptor: '',
                                          isLargePreview: false,
                                        },
                                      }
                                    );

  const ReactEditorJS = createReactEditorJS()

  const [blocks ,setBlocks] = useState({});            
  const [author, setAuthor] = useState([]);
  const [tags, setTags] = React.useState([]);


  const KeyCodes = {
    comma: 188,
    enter: 13
  };
  
  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  // useEffect(() => {
  //   let userId = authState.authdata.insertedID
  //   async function get_posts() {
  //     Promise.all([

  //       fetch(`http://127.0.0.1:8080/api/author/` + userId, {
  //         headers : { 
  //           'Content-Type': 'application/json',
  //           'Accept': 'application/json'
  //          }
  //       }).then((response) => response.json())
  //     ])
  //       .then((results) => {
  //         setAuthor(results[0][0])
  //       });
  //   }
  //   get_posts()
  // }, []);

  const handleTagClick = index => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  const handleInputChange = (e) => {
    setState({
      formData: {
        ...state.formData,
        [e.target.name]: e.target.value,
      },
    });
  }

  const handleCheckboxChange = (e) => {
    setState({
      formData: {
        ...state.formData,
        isLargePreview: e.target.checked,

      },
    });
  }

  const handleSaveBtnClick = (visible) => {
    console.log(visible)
    fetch(`http://127.0.0.1:8080/api/post/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...state.formData,
        contentMarkup: blocks,
        userId : authState.authdata.user_id,
        tags : tags,
        visible : visible
      }),
    })
    .then(function(response) {
      // The response is a Response instance.
      // You parse the data into a useable format using `.json()`
      return response.json();
    }).then(function(data) {
      // `data` is the parsed version of the JSON returned from the above endpoint.
      console.log('response',data);
      navigate(`/blogs/1/posts/` + data.id);
        // { "userId": 1, "id": 1, "title": "...", "body": "..." }
    });

  }

  const handleOnChange = async (api) => {
    const body = await api.saver.save();
    console.log('handle on change',body); // This value is stale and doesn't get updated with re-renders.
    setBlocks(body)
  };

    const inputData = state.formData ;

    console.log('inputdata',inputData)


    return (
      <main>
        <div className={styles['post-meta']}>
          <div className={styles['user-info']}>
            <a className="avatar avatar--middle avatar--circled" href="#">
              <img src={authState.authdata.avatarUrl} />
            </a>
            <a className={styles.author} href="#">{authState.authdata.username}</a>
          </div>

          <div className={styles['post-tags']}>
          { tags ? 
          <ReactTags
            classNames={TagStyles['tagsClass']}
            tags={tags}
            // suggestions={suggestions}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            handleTagClick={handleTagClick}
            inputFieldPosition="inline"
            autocomplete
            />
            :
            <div>yoooooooooooooooooo</div>
          }
        </div>

        <InputFields
          inputData={inputData}
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />

        <div>
                <ReactEditorJS
                  onChange={handleOnChange}
                  defaultValue={
                    [
                      {
                        id: "sheNwCUP5A",
                        type: "header",
                        data: {
                          text: "Editor.js",
                          level: 2
                        }
                      },
                      {
                        id: "12iM3lqzcm",
                        type: "paragraph",
                        data: {
                          text:
                            "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text."
                        }
                      },
                      {
                        id: "fvZGuFXHmK",
                        type: "header",
                        data: {
                          text: "Key features",
                          level: 3
                        }
                      }
                    ]
                  }
                  tools={EDITOR_JS_TOOLS}
                />
        </div>


        </div>
        <div className={`${postTextStyles['post-text']} js-editable`} dangerouslySetInnerHTML={{ __html: '' }} />
        <div className={styles['post-actions']}>
          <button className="btn" onClick={() => handleSaveBtnClick(false)}>Save Draft</button>
          <button className="btn" onClick={() => handleSaveBtnClick(true)}>Publish</button>

          {/* <Link  className="btn" to={`/blogs/1/posts/${post._id}`} onClick={handleSaveBtnClick}>Save</Link> */}
          <Link className={styles.cancel} to={`/}`}>Cancel</Link>
        </div>
      </main>
    );
};

export default CreateScreen;
