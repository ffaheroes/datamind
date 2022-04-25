import React, {useContext, useEffect, useRef, useState,useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { GlobalContextConsumer } from '../../../utils/context';
import storageHelper from '../../../utils/storageHelper';
import GuestLinks from './components/GuestLinks';
import UserLinks from './components/UserLinks';
import { withRouter } from '../../../hooks/withRouter';
import styles from './Header.module.scss';
import { GlobalContext } from '../../../context/Provider';
import { LOGOUT_USER } from '../../../context/actionTypes';
import { Link,useNavigate } from 'react-router-dom';

const Header = () => {

  const {authDispatch,authState} = useContext(GlobalContext);
  let navigate = useNavigate();

  console.log('authstate',authState)

  const handleLogout = (e) => {
    console.log('handlelogout')
    e.preventDefault();
    authDispatch({
      type: LOGOUT_USER,
    });

    navigate('/');
    // axios.post('http://127.0.0.1:8080/api/auth/logout')
    //   .then(() => {
    //     storageHelper.removeData();
    //     axios.defaults.headers.common.Authorization = undefined;



    //     // history.push('/');
    //   }, window.alert);
  };

  return (

    <header className={styles.page}>
      <div className={styles.inner}>
        <div className={styles['link-set']}>
          <Link className={styles.logo} to="/" />
        </div>
        <div className={styles.actions}>
        {/* <GuestLinks /> */}
          {
            authState.isLoggedIn
              ? <UserLinks user={authState.authData} onLogout={handleLogout} />
              : <GuestLinks />
          }
          {/* <Link  className="btn" to={`/create`} onClick={this.handleSaveBtnClick}>New Article</Link> */}
          {/* <Link  className="btn" to={`/create`}>New Article</Link> */}
          {/* <GuestLinks /> */}
        </div>
      </div>
    </header>
  );

};

Header.propTypes = {
  history: PropTypes.object.isRequired,
};

const HeaderWithRouter = withRouter(Header);
// const HeaderWithRouter = Header;

export default HeaderWithRouter;

/* eslint max-len: off */
