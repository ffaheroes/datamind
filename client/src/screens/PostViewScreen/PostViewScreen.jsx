import React, {useContext, useEffect, useRef, useState,useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import { Link,useNavigate } from 'react-router-dom';
import Spinner from '../../components/shared/Spinner';
import PreContent from '../../components/shared/PreContent';
import PostHeader from './components/PostHeader';
import PostImage from './components/PostImage';
import PostText from './components/PostText';
// import PostText from '../../components/shared/PostText';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from './PostViewScreen.module.scss';
import TagStyles from './../../assets/styles/TagStyles.css'
import { WithContext as ReactTags } from 'react-tag-input';
import { GlobalContext } from '../../context/Provider'
import Prism from "prismjs";

const PostViewScreen = () => {

  let navigate = useNavigate();

  const {authDispatch,authState} = useContext(GlobalContext);

  const params = useParams()
  const postId = params.postId;
  const blogId = params.blogId;

  const [data, setData] = useState(false);
  const [post, setPost] = useState([]);
  const [author, setAuthor] = useState([]);
  const [enableChange, setEnableChange] = useState(false);
  const [relatedSeries, setRelatedSeries] = useState([]);

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
        fetch(`http://127.0.0.1:8080/api/post/related/` + postId, {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
        }).then((response) => response.json()),
      ])
        .then((results) => {


          setRelatedSeries(results[2])

          // get the auhorID of the owner of the post
          let authorId = results[1][0]

          console.log('enablechange',authorId,authState.authdata.user_id)
          if (authState.isLoggedIn) {
            if (authorId.userId==authState.authdata.user_id){
              setEnableChange(true)
            }
          }

          // Filtering author to get the good one
          setAuthor(results[0].filter(d => d._id === authorId.userId)[0])
          setPost(results[1][0])
          setTags(results[1][0]['tags'])
          setAuthor(results[0])
          setData(true);
          console.log(author)
        });
    }
    get_posts()
  }, []);


  const [tags, setTags] = React.useState([
  ]);

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


  const handleonclick = (id) => {
    navigate('/blogs/1/posts/'+id)
    window.location.reload()
  }


  console.log('Related Series',relatedSeries)
  
  // useEffect(() => {
  //   Prism.highlightAll()
  // }, []);
  
  if (!data) {
    return (<Spinner />);
  }

  return (
    <main>
      <div className={styles['main-container']}>
        <div className={styles['post-meta']}>
          <PostHeader post={post} author={author.filter(d => d._id === post.userId)[0]} />
          { tags ? 
          <ReactTags
              classNames={TagStyles['tagsClass']}
              tags={tags}
              readOnly = {true}
            />
            :
            <div></div>
          }
            <PostImage post={post} />
            <PostText post={post} />
        </div>

        <div className={styles['sidebar']}>

           <span className={styles['post-profile']}>
            <a className="avatar avatar--big avatar--circled" href="https://blog.kentcdodds.com/@kentcdodds" target="_blank" rel="noopener noreferrer">
              <img src={author.filter(d => d._id === post.userId)[0].avatarUrl} />
            </a>
            <div className={styles.text}>
              <div className={styles.title}>
                <a href="https://blog.kentcdodds.com/@kentcdodds" target="_blank" rel="noopener noreferrer">
                  {author.filter(d => d._id === post.userId)[0].username}
                </a>
                <button className={`btn btn--smallest ${styles.follow}`}>Follow</button>
              </div>
              <div className={styles.descr}>{author.filter(d => d._id === post.userId)[0].bio}</div>
              <div className={styles.meta}>
                {post.date} · {post.readTimeEstimate}
              </div>
            </div>
            </span>


            <div className={styles.series}>
              
              
              
              { relatedSeries[0]['series'] ? 
                <div>{relatedSeries[0]['series']}</div>
                : <div></div>
              }

              {
                  relatedSeries.map((item) => (


                    <Link to={`/blogs/1/posts/${item._id}`} onClick={() => {
                                                                            navigate('/blogs/1/posts/'+item._id);
                                                                            window.location.reload()}}>
                      <div className={styles.seriesitem} >
                        {item.title}
                      </div>
                    </Link>


                  ))
                }


              {/* <div className={styles.seriesitem}>
               Title 1 dkf^rf^rf hkh kdf  eoooe sd^^zer ddffre
              </div>
              <div className={styles.seriesitem}>
               Title 2 tiltle tslsdl Node JS Api with Express
              </div>
                 */}
            </div>

        </div>
      </div>

        <footer className={styles['post-footer']}>


        {
            enableChange
              ? 
                <div className={styles['post-actions']}>
                <Link className="btn" to={`/blogs/`+blogId+`/posts/`+postId+`/edit`}>
                  Edit
                </Link>
                </div>
              : <div></div>
          }



        </footer>
      {/* </article> */}
    </main>
  );
};

export default PostViewScreen;
