import React, { useState } from "react";
import cn from "classnames";
import { HeartOutline,Heart} from 'react-ionicons'
import styles from './LikeButton.module.scss';


const LikeButton = ({liked,nblike,onLikedChange}) => {

  console.log('liked',liked)
  return (
    <div style={{display:"flex"}}>
      <button
          className={liked ? styles["like-button-circle-liked"] : styles["like-button-circle"]}
          onClick={() => onLikedChange()}
          onAnimationEnd={() => onLikedChange()}

          >

          <div className={liked ? styles[`like-button-icon-liked`] : styles[`like-button-icon`]}>
          <a style={{color:"white"}}>{ liked ?<Heart color="white"/>: <HeartOutline />}</a>
          </div>
          
          {/* <span>Like</span>
          <span className={liked ? styles["like-button.suffix"]:styles["like-button"] }>d</span> */}

      </button>
      <div style={{fontSize:"14px",paddingLeft:"4px", display:'flex' ,alignItems: 'center',position: 'relative',top: '50%'}}>
        {nblike}
      </div>
    </div>
  );
};

export default LikeButton;