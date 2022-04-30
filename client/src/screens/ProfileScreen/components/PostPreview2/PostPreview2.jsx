import React, { useEffect,useContext,useState } from 'react';
import styles from './PostPreview2.module.scss';
import { Link } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import { GlobalContext} from '../../../../context/Provider';



const PostPreview2 = ({ post, author }) => {

  const {authDispatch,authState} = useContext(GlobalContext);
  const [enableChange, setEnableChange] = useState(false);

  useEffect(() => {
    console.log('authState',authState)
    if (authState.isLoggedIn) {
      if (author.username === authState.authdata.username) {
        setEnableChange(true)
      }
    }
  }, []);


  return (
  <header className={styles['post-header']}>
    <div className={styles['post-text']}>
      <Link to={`/blogs/${post.blogId}/posts/${post._id}`}>
        <div className={styles['post-title']}>{post.title} </div>
        <div className={styles['post-subtitle']}>{post.subTitle} </div>
      </Link>
        <span className={styles['post-profile']}>

          { enableChange 
          ?
          <div>
              <Switch defaultChecked size="small"/>
          </div>
          :
          <div>
              <Switch disabled defaultChecked size="small"/>
          </div>
          }

          <div className={styles.meta}>
          {post.date} · {post.readTimeEstimate}
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
)
};


export default PostPreview2;
