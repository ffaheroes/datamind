import React, {useContext, useEffect, useRef, useState,useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../components/shared/Spinner';
import { Link,useNavigate } from 'react-router-dom';
import MediumEditor from 'medium-editor';
import InputFields from './components/InputFields';
import styles from './PostEditScreen.module.scss';
import postTextStyles from '../../components/shared/PostText/PostText.module.scss';
import { useParams } from 'react-router-dom';
import { WithContext as ReactTags } from 'react-tag-input';
import TagStyles from './../../assets/styles/TagStyles.css'
import { GlobalContext } from '../../context/Provider'
import { FaPlus } from 'react-icons/fa';
import { Button,Modal,Form,} from 'react-bootstrap';
import { CreateOutline,CodeWorkingOutline} from 'react-ionicons'
import { ADD_SERIES } from '../../context/actionTypes';

const PostEditScreen = () => {

  const {authDispatch,authState} = useContext(GlobalContext);



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



  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [tags, setTags] = React.useState([{}]);

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

  const handleTagClick = index => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  const params = useParams()
  const postId = params.postId;
  const blogId = params.blogId;
  const [data, setData] = useState({});
  const [post, setPost] = useState([]);
  const [enableChange, setEnableChange] = useState(false);
  const [author, setAuthor] = useState([]);
  const [series, setSeries] = useState();
  const [listseries, setListSeries] = useState(authState.authdata.series);
  const [active, setActive] = useState('yo');


  useEffect(() => {
    async function get_posts() {
      Promise.all([
        fetch(`http://127.0.0.1:8080/api/author`, {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
        }).then((response) => response.json()),
        fetch(`http://127.0.0.1:8080/api/post/` + postId, {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
        }).then((response) => response.json()),
      ])
        .then((results) => {
          // get the auhorID of the owner of the post
          let authorId = results[1][0]

          console.log('enablechange',authorId,authState.authdata.user_id)
          if (authorId.userId==authState.authdata.user_id){
            
            setEnableChange(true)
          }

          // Filtering author to get the good one
          setAuthor(results[0].filter(d => d._id === authorId.userId)[0])
          setPost(results[1][0])
          // handling post with no tags
          if (results[1][0]['tags'] == null) {
          setTags([])
          } else {
          setTags(results[1][0]['tags'])
          }


          if (results[1][0]['series'] == null) {
            setActive([])
            } else {
            setActive(results[1][0]['series'])
            }
          
          setData({
            data: {author, post},
          });
          setState({
            formData: results[1][0],
          });
        });
    }
    get_posts()
  }, []);


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
          tagNames: ['code'],
          contentDefault: 'CODE',
        },
      ],
    },
    placeholder: {
      text: '',
      hideOnClick: false,
    },
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


  const displaycreate = () => {
  var element = document.getElementById('form-create');
  element.style.display = 'block';
  element.style.visibility = 'visible';
  }

  const handleSaveBtnClick = () => {
    console.log('saving',JSON.stringify({
      ...state.formData,
      contentMarkup: document.querySelector('.js-editable').innerHTML,
    }))
    fetch(`http://127.0.0.1:8080/api/post/`+ postId , {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...state.formData,
        contentMarkup: document.querySelector('.js-editable').innerHTML,
        tags : tags,
      }),
    })
      .then(() => { console.log('fuck');});
  }


  const handleSeriesSave = (selectedseries) => {
    
    console.log('handleseriessave',selectedseries)
    setActive(selectedseries)


    fetch(`http://127.0.0.1:8080/api/post/series/`+ postId , {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        series : selectedseries,
      }),
    })
      .then(() => { console.log('series');});

  }

  const handleNewSeriesSave = () => {
    let newseries = document.getElementById('seriesinput').value
    // add to list series
    setListSeries([...listseries, newseries])
    // dispatch for global context (we want this new series to be available everywhere)
    authDispatch({
      type: ADD_SERIES,
      payload: newseries,
    });
    // set as the one ticked
    setActive(newseries)
    // hide the create part
    var element = document.getElementById('form-create');
    element.style.display = 'none';
    element.style.visibility = 'hidden';


    console.log('Newseriessave',newseries)

    fetch(`http://127.0.0.1:8080/api/post/series/`+ postId , {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        series : newseries,
      }),
    })
      .then(() => { console.log('series');});

  

  }

  const handleDeleteBtnClick = () => {
    fetch(`http://127.0.0.1:8080/api/post/`+ postId , {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...state.formData
      }),
    })
      .then(() => { console.log('deleted');});
  }

  

    if (!data) {
      return (<Spinner />);
    }

    const inputData = state.formData ;


    return (
      <main>
        <div className={styles['post-meta']}>
          <div className={styles['user-info']}>
            <div className={styles['user-block']}>
              <a className="avatar avatar--middle avatar--circled" href="#">
                <img src={author.avatarUrl} />
              </a>
              <a className={styles.author} href="#">{author.username}</a>
            </div>
          
            {
            enableChange

              ? <div className={styles['link-series']}>

            <CodeWorkingOutline
              onClick={handleShow}
              color={'#00000'}
              height="25px"
              width="25px"
            />

              <Modal 
              size="sm"
              show={show} 
              onHide={handleClose}>
                <Modal.Header className='modal-header' closeButton>
                <div style={{height:'20px !important',fontSize:'18px',alignItem:'center',padding:'10px', color : 'black'}} >Save in ...</div>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <div key='222' className="mb-3">
                      {
                        listseries.map((serie, index) => (
                              <Form.Check 
                                type="radio"
                                id={index}
                                label={serie}
                                checked={active == serie}
                                onChange= {() => handleSeriesSave(serie)}
                            />
                        ))
                      }
                    </div>
                  </Form>
                  


                </Modal.Body>

                  <div style={{fontSize:'18px',height:'50px',alignItem:'center',marginTop:'-20px',padding:'10px', color : 'black', borderTop: '1px solid #D3D3D3',borderBottom: '1px solid #D3D3D3'}} onClick={displaycreate}>

                  Create a Series
                  <div style={{float:'right'}}>
                  <CreateOutline
                    color={'#00000'}
                    height="25px"
                    width="25px"
                  />
                  </div>
                  
                  </div>
                  
                  <div id='form-create' style={{marginTop: '10px',padding:'10px',display : 'none',visibility:'hidden'}}>
                    <input id='seriesinput' type="text" placeholder="New Series" />
                    <span style={{fontSize:'16px',marginTop: '10px', color : 'blue', fontWeight : 'bold',float:'right'}} onClick={handleNewSeriesSave}>CREATE</span>
                  </div>
              </Modal>
            </div>

              : <div></div>
            }
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
        <div className={`${postTextStyles['post-text']} js-editable`} dangerouslySetInnerHTML={{ __html: post.contentMarkup }} />

          {
            enableChange
              ? 
                <div className={styles['post-actions']}>
                  <Link  className="btn" to={`/blogs/1/posts/${post._id}`} onClick={handleSaveBtnClick}>Save</Link>
                  <Link className={styles.cancel} to={`/blogs/1/posts/${post._id}`}>Cancel</Link>
                  <Link className={styles.delete} to={`/`} onClick={handleDeleteBtnClick}>Delete</Link>
                </div>
              : <div></div>
          }
          
          
          
        
      </main>
    );
};

export default PostEditScreen;
