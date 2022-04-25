import React, {useContext, useEffect, useRef, useState,useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../components/shared/Spinner';
import { Link,useNavigate } from 'react-router-dom';
import MediumEditor from 'medium-editor';
import InputFields from './components/InputFields';
import styles from './CreateScreen.module.scss';
import postTextStyles from '../../components/shared/PostText/PostText.module.scss';
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../context/Provider';
import auth from '../../context/reducers/auth';
import { WithContext as ReactTags } from 'react-tag-input';
import TagStyles from './../../assets/styles/TagStyles.css'

const CreateScreen = () => {
  const {authDispatch,authState} = useContext(GlobalContext);
  console.log('createscreen authstate',authState)
  let navigate = useNavigate();
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


  const editor  = new MediumEditor('.js-editable', {
    targetBlank: true,
    toolbar: {
      buttons: [
        'bold', 'italic', 'underline', 'anchor', 'h3', 'h4',
        {
          name: 'unorderedlist',
          contentDefault: '<b>UL</b>',
        },
        {
          name: 'orderedlist',
          contentDefault: '<b>OL</b>',
        },
        'quote',
        {
          name: 'pre',
          action: 'append-pre',
          tagNames: ['pre'],
          contentDefault: 'PRE',
        },
        {
          name: 'strikethrough',
          action: 'strikethrough',
          tagNames: ['strike'],
          contentDefault: 'CODE',
        },
      ],
    },
    // placeholder: {
    //   text: 'Tell your story...',
    //   hideOnClick: false,
    // },
  });



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

  const handleSaveBtnClick =  () => {

    fetch(`http://127.0.0.1:8080/api/post/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...state.formData,
        contentMarkup: document.querySelector('.js-editable').innerHTML,
        userId : authState.authdata.user_id,
        tags : tags,
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
  

    // if (!data) {
    //   return (<Spinner />);
    // }

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
        </div>
        <div className={`${postTextStyles['post-text']} js-editable`} dangerouslySetInnerHTML={{ __html: '' }} />
        <div className={styles['post-actions']}>
          <button className="btn" onClick={handleSaveBtnClick}>Save</button>
          {/* <Link  className="btn" to={`/blogs/1/posts/${post._id}`} onClick={handleSaveBtnClick}>Save</Link> */}
          <Link className={styles.cancel} to={`/}`}>Cancel</Link>
        </div>
      </main>
    );
};

export default CreateScreen;
