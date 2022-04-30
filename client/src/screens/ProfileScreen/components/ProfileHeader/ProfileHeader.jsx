import React, { useEffect,useContext,useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ProfileHeader.module.scss';
import { CreateOutline,SaveOutline,LogoGithub,LogoGitlab,LogoLinkedin,LogoMedium} from 'react-ionicons'
import { GlobalContext} from '../../../../context/Provider';
import Button from '@mui/material/Button'

const ProfileHeader = ({ author }) => {

  const {authDispatch,authState} = useContext(GlobalContext);
  const [enableChange, setEnableChange] = useState(false);
  const [editView, setEditView] = useState(false);
  console.log(author)
  const [state, setState] = useState({
                                        bio: author.bio,
                                        github: author.links ? author.links.github : '' ,
                                        gitlab: author.links ? author.links.githlab : '',
                                        linkedin: author.links ? author.links.linkedin : '',
                                        medium: author.links? author.links.medium : '',
                                      }
                                    );



  const handleInputChange = (e) => {
    setState({
    ...state,
    [e.target.name]: e.target.value,
    });
    console.log(state)
  }

  const logoclick = (target) => {
    var allelements = document.getElementById('editlinks').children;

    for(var i = 0; i < allelements.length; i++) {
      console.log(allelements[i].lastChild.id)
      if (allelements[i].lastChild.id === target + '_input'){
        if (allelements[i].lastChild.style.display ==='none'){
          allelements[i].lastChild.style.display = 'block';
          allelements[i].lastChild.style.visibility = 'visible';
        } else {
          allelements[i].lastChild.style.display = 'none';
          allelements[i].lastChild.style.visibility = 'hidden';
        }
      } else {
        allelements[i].lastChild.style.display = 'none';
        allelements[i].lastChild.style.visibility = 'hidden';
      }
    }

    // var element = document.getElementById(target + '_input');
    // if (element.style.display ==='none'){
    //   element.style.display = 'block';
    //   element.style.visibility = 'visible';
    // } else {
    //   element.style.display = 'none';
    //   element.style.visibility = 'hidden';
    // }
  }

  

  useEffect(() => {
    console.log('authState',authState)
    if (authState.isLoggedIn) {
      if (author.username === authState.authdata.username) {
        setEnableChange(true)
      }
    }
  }, []);

  const editButtonClick = () => {
    console.log('editbuttonclick');
    setEditView(true)
  };

  const saveButtonClick = () => {
    console.log('savebuttonclick');
    setEditView(false)


    // Edit Profile

    // PATCH Query

    fetch(`http://127.0.0.1:8080/api/author/updateprofile/`+ authState.authdata.user_id , {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bio : state.bio,
        links : { 'github' : state.github,'gitlab' : state.gitlab,'linkedin' : state.linkedin,'medium' : state.medium},
      }),
    })
      .then(() => { console.log('series');});


  };



  return (
    // <div className={styles['blog-header']} style={{ backgroundImage: `url(https://media.idownloadblog.com/wp-content/uploads/2021/06/macOS-Monterey-wallpaper-Dark.jpg)` }}>
    <div className={styles['post-header']}>
      <a className="avatar avatar--big avatar--circled" href="https://blog.kentcdodds.com/@kentcdodds" target="_blank" rel="noopener noreferrer">
        <img src={author.avatarUrl} />
      </a>

          {
          editView
          ? 
              <div className={styles.text}>
                <div className={styles.title}>
                  <a href="https://blog.kentcdodds.com/@kentcdodds" target="_blank" rel="noopener noreferrer">
                    {author.username}
                  </a>
                </div>
                <input type="text" className={styles.input}  value={state.bio} onChange={handleInputChange} name="bio" placeholder={author.bio ? author.bio : 'About me' } />
                

                  <div id="editlinks" className={styles.links}>
                    <div className={styles.linksgroup}>
                      <LogoGithub
                      onClick={() => logoclick('github')}
                      color={'#00000'}
                      height="20px"
                      width="20px"
                      />
                      <input id="github_input" type="text" className={styles.input} style={{display:'none',visibility:'hidden'}} value={state.github} onChange={handleInputChange} name="github" placeholder="my links"/>
                    </div>
                    <div className={styles.linksgroup}>
                      <LogoGitlab
                      onClick={() => logoclick('gitlab')}
                      color={'#00000'}
                      height="20px"
                      width="20px"
                      />
                      <input id="gitlab_input" type="text" className={styles.input} style={{display:'none',visibility:'hidden'}} value={state.gitlab} onChange={handleInputChange} name="gitlab" placeholder="my links"/>
                    </div>
                    <div className={styles.linksgroup}>
                      <LogoLinkedin
                      onClick={() => logoclick('linkedin')}
                      color={'#00000'}
                      height="20px"
                      width="20px"
                      />
                      <input id="linkedin_input" type="text" className={styles.input} style={{display:'none',visibility:'hidden'}} value={state.linkedin} onChange={handleInputChange} name="linkedin" placeholder="my links"/>
                    </div>
                    <div className={styles.linksgroup}>
                      <LogoMedium
                      onClick={() => logoclick('medium')}
                      color={'#00000'}
                      height="20px"
                      width="20px"
                      />
                      <input id="medium_input" type="text" className={styles.input} style={{display:'none',visibility:'hidden'}} value={state.medium} onChange={handleInputChange} name="medium" placeholder="my links"/>
                    </div>


                  </div>

                  
                
                

              </div>
          : 
              <div className={styles.text}>
              <div className={styles.title}>
                <a href="https://blog.kentcdodds.com/@kentcdodds" target="_blank" rel="noopener noreferrer">
                  {author.username}
                </a>
              </div>
              <div className={styles.descr}>{state.bio}</div>
              <div className={styles.links}>
                {state.github != ''
                  ? <span className={styles.linksgroup}><a href={state.github}><LogoGithub color={'#00000'} height="20px" width="20px"/></a></span> 
                  : <div></div>
                }
                {state.gitlab !=''
                  ? <span className={styles.linksgroup}><a href={state.gitlab}><LogoGitlab color={'#00000'} height="20px" width="20px"/></a></span>
                  : <div></div>
                }
                {state.linkedin !=''
                  ? <span className={styles.linksgroup}><a href={state.linkedin}><LogoLinkedin color={'#00000'} height="20px" width="20px"/></a></span>
                  : <div></div>
                }
                {state.medium !=''
                  ? <span className={styles.linksgroup}><a href={state.medium}><LogoMedium color={'#00000'} height="20px" width="20px"/></a></span>
                  : <div></div>
                }
              </div>
            </div>
          }

          {
          enableChange
          ? 
            editView
            ?
              <SaveOutline
                      style={{position:'absolute',right: '5px',bottom: '5px'}}
                      onClick={saveButtonClick}
                      color={'#00000'}
                      height="20px"
                      width="20px"
              />
            :
              <CreateOutline
                    style={{position:'absolute',right: '5px',bottom: '5px'}}
                    onClick={editButtonClick}
                    color={'#00000'}
                    height="20px"
                    width="20px"
              />
          : 
            <div></div>
          }


    </div>

  );
};

export default ProfileHeader;

/* eslint no-nested-ternary: off */
