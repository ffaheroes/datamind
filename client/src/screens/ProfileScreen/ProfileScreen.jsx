import React, {useContext, useEffect, useRef, useState,useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../components/shared/Spinner';
import BlogHeader from './components/BlogHeader';
import ProfileHeader from './components/ProfileHeader';
import PreContent from '../../components/shared/PreContent';
import PostPreview2 from './components/PostPreview2';
import Footing from './components/Footing';
import styles from './BlogScreen.module.scss';
import { on } from 'medium-editor';
import Code from '../../components/shared/Code';
import { useParams } from 'react-router-dom';



const ProfileScreen = () => {

  const params = useParams()
  const blogName = params.blogName;

  console.log(blogName)

  const [data, setData] = useState(false);
  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleMouseIn = (tagsarr) => {
    tagsarr.map((t) => {
      var element = document.getElementById(t.id);
      element.style.backgroundColor = "#243e57";
      element.style.transition = "all 0.8s"
      element.style.color= '#fff';
    })
  };

  const handleMouseOut = (tagsarr) => {
    tagsarr.map((t) => { // We need to handle the current user selection !
      if (selectedTags.indexOf(t.text) == -1) { // if tag is not in selected list then back to white
            var element = document.getElementById(t.id);
            element.style.backgroundColor = 'white';
            element.style.color= 'black';
      }
    })
  };

  const handleonclick = (tagstext) => {
    var element = document.getElementById(tagstext);
    if (selectedTags.indexOf(tagstext) === -1) { 
      // NEW SELECTION
      setSelectedTags([...selectedTags, tagstext])
      element.style.backgroundColor = "#243e57";
      element.style.transition = "all 0.8s"
      element.style.color= '#fff';
      // HIDE DIV That doesnt have these tags
      posts.map((post) => {
        var gg = [] // is the array of tags per post
        post.tags.map((item) => {gg.push(item.text)})
        if (gg.indexOf(tagstext) === -1) { // if the tagselected is not in the post we hide it
          var element = document.getElementById(post._id);
          element.style.display = 'none';
          element.style.visibility = 'hidden';
        }
      })

    } else {
      // DESELECTION
      let filteredArray = selectedTags.filter(item => item !== tagstext)
      setSelectedTags(filteredArray)
      element.style.backgroundColor = 'white';
      element.style.color= 'black';
      // Show ALL Screen that respect selected tags = []
      posts.map((post) => {
        var gg = [] // is the array of tags per post
        post.tags.map((item) => {gg.push(item.text)})
        let checker = (arr, target) => target.every(v => arr.includes(v)); // Help functio that check if everything is in the second array
        if (checker(gg,filteredArray)) { 
          var element = document.getElementById(post._id);
          element.style.display = 'block';
          element.style.visibility = 'visible';
        }
      })
    }
  };

  const techstack = {
                    'reporting_systems' : ['react','tableau','powerbi','flask','dash'],
                    'integration' : ['alteryx','api','express','elt','etl','talend'],
                    'database_systems' : ['postgresql','mongodb','snowflake','spark'],
                    'platform_devops' : ['postman','git','gitlab','jenkins','aws','azure','gcp','terraform'],
                    'language': ['python','javascript','nodejs','scala']

                    }

  useEffect(() => {
    async function get_posts() {
        fetch(`http://127.0.0.1:8080/api/author/getidbyname/` + blogName, {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
        })
        .then((response) => response.json())
        .then(res => {
          setAuthor(res[0])
          console.log('res',res,res[0].user_id)
          fetch(`http://127.0.0.1:8080/api/post/getpostbyuserid/` + res[0].user_id, {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
          })
          .then((response) => response.json())
          .then((results) => {
            console.log('result promise0',results)
            var tagsarr = [];
            results.map((post) => 
            {tagsarr.push(post.tags)
            }) 
            var flatarr= tagsarr.flat(1)
            const ids = flatarr.map(o => o.id)
            const filtered = flatarr.filter(({id}, index) => !ids.includes(id, index + 1))
            setTags(filtered)
            setPosts(results)
            setData(true);
          })
        });
    }
    get_posts()
  }, []);


  const code = `const App = props => {
    return (
      <div>
        <h1> React App </h1>
        <div>Awesome code</div>
      </div>
    );
  };
  `;

  if (!data) {
    return (<Spinner />);
  }

  return (
      <main>

          

            <div className={styles['main-container']}>
              <div className={styles['posts']}>
              <ProfileHeader author={author} />
                {
                  posts.map((post) => (
                    <div id = {post._id} onMouseEnter={(value) => handleMouseIn(post.tags)} onMouseLeave={(value)=>handleMouseOut(post.tags)}>
                      <PostPreview2 
                        post={post} 
                        author={author} 
                        key={post._id} 
                      />
                    </div>
                  ))
                }


              {/* <Code code={code} language="javascript"/> */}
              
              </div>
              <div className={styles['sidebar']}>
                <div className={styles['sidebar-title']}>
                  Tech Stack
                </div>
                <div className={styles['sidebar-category']}>
                  <div className={styles['sidebar-titlecat']}>Reporting Systems</div>
                  {
                    tags.map((tag) => {
                      if( techstack.reporting_systems.indexOf(tag.text) > -1)
                    return (
                        <div id={tag.text} onClick={(value) => handleonclick(tag.text)} className={styles['sidebar-tags']}>
                          {tag.text}
                        </div>
                    )})
                  }
                </div>
                <div className={styles['sidebar-category']}>
                  <div className={styles['sidebar-titlecat']}>Integration</div>
                  {
                    tags.map((tag) => {
                      if( techstack.integration.indexOf(tag.text) > -1)
                    return (
                        <div id={tag.text} onClick={(value) => handleonclick(tag.text)} className={styles['sidebar-tags']}>
                          {tag.text}
                        </div>
                    )})
                  }
                </div>
                <div className={styles['sidebar-category']}>
                  <div className={styles['sidebar-titlecat']}>Database Systems</div>
                  {
                    tags.map((tag) => {
                      if( techstack.database_systems.indexOf(tag.text) > -1)
                    return (
                        <div id={tag.text} onClick={(value) => handleonclick(tag.text)} className={styles['sidebar-tags']}>
                          {tag.text}
                        </div>
                    )})
                  }
                </div>
                <div className={styles['sidebar-category']}>
                  <div className={styles['sidebar-titlecat']}>Platform and Devops</div>
                  {
                    tags.map((tag) => {
                    if( techstack.platform_devops.indexOf(tag.text) > -1)
                    return (
                        <div id={tag.text} onClick={(value) => handleonclick(tag.text)} className={styles['sidebar-tags']}>
                          {tag.text}
                        </div>
                    )})
                  }
                </div>
                <div className={styles['sidebar-category']}>
                  <div className={styles['sidebar-titlecat']}>Language</div>
                  {
                    tags.map((tag) => {
                    if( techstack.language.indexOf(tag.text) > -1)
                    return (
                        <div id={tag.text} onClick={(value) => handleonclick(tag.text)} className={styles['sidebar-tags']}>
                          {tag.text}
                        </div>
                    )})
                  }
                </div>
              </div>
            </div>

            <Footing />
            
      </main>
    );
}

export default ProfileScreen;
