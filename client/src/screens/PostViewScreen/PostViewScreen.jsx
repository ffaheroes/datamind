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
import LikeButton from '../../components/shared/LikeButton';

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
  const [liked, setLiked] = useState(false);

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
          let thispost = results[1][0]
          console.log('thispost',thispost)

          if (authState.isLoggedIn) {
            console.log('auth is logged')
            // Authorize change
            if (thispost.userId==authState.authdata.user_id){
              console.log('user is author')
              setEnableChange(true)
            }
            // Set Color of Likes
            if (thispost.metrics.like) {
              thispost.metrics.like.map((item) => {
                if (item.user_id==authState.authdata.user_id){
                  console.log('auth is logged and auth already liked')
                  setLiked(true)
                }
              })
            }
            
          }

          // Filtering author to get the good one
          setAuthor(results[0].filter(d => d._id === thispost.userId)[0])
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

  const handleLikedChange = (e) => {




    
    if (!liked) {

      console.log(post.metrics.like)
      if (!post.metrics.like){
        var list_like = [{user_id : authState.authdata.user_id, username: authState.authdata.username,timestamps : new Date()}]
      } else {
        var list_like = [...post.metrics.like,{user_id : authState.authdata.user_id, username: authState.authdata.username,timestamps : new Date()}]
      }

    console.log('patch query',list_like)
    fetch(`http://127.0.0.1:8080/api/post/like/`+ postId , {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify( {comment : post.metrics.comment,
        like : list_like
      }),
    })
    .then(() => { console.log('series');});


    setPost({
      ...post,
      metrics : { comment : post.metrics.comment,
                  like : list_like
                }
     });

  } else {
    if (authState.isLoggedIn) {   // USER IS LOGGED
      post.metrics.like.map((item) => { 
        console.log('map item',item) // CHECK IF USER CURENTLY LOGGED IS IN LIST OF LIKES
        if (item.user_id==authState.authdata.user_id){ // USER IS LIST OF LIKES
          console.log('user Unlike, rest = ',post.metrics.like.filter((it)=> it.username !==authState.authdata.username ))
          fetch(`http://127.0.0.1:8080/api/post/like/`+ postId , { // POST QUERY TON UNLIKE/REMOVE THE USER
            method: 'PATCH',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify( {comment : post.metrics.comment,
              like : post.metrics.like.filter((it)=> it.username !==authState.authdata.username )
            }),
          })
          .then(() => { console.log('series');});

          setPost({
            ...post,
            metrics : { comment : post.metrics.comment,
                        like : post.metrics.like.filter((it)=> it.username !==authState.authdata.username )
                      }
           });


        }
      })
    }
  }


   setLiked(!liked)


  }

  console.log('post',post)

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
            <PostImage post={post}/>
            <PostText post={post}/>

            <LikeButton liked={liked} 
                        onLikedChange={handleLikedChange}/>


        </div>

        <div className={styles['sidebar']}>

           <span className={styles['post-profile']}>
            <a className="avatar avatar--big avatar--circled" href="https://blog.kentcdodds.com/@kentcdodds" target="_blank" rel="noopener noreferrer">
              <img src={author.filter(d => d._id === post.userId)[0].avatarUrl} />
            </a>
            <div className={styles.text}>
              <div className={styles.title}>

              <Link to={`/blogs/${author.filter(d => d._id === post.userId)[0].username}`}>
              <div>{author.filter(d => d._id === post.userId)[0].username}</div>
              </Link>

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
