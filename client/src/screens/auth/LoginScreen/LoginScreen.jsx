import React, {useContext, useEffect, useRef, useState,useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import queryString from 'query-string';
import { Link,useNavigate } from 'react-router-dom';
import { withRouter } from '../../../hooks/withRouter';
import { contextShape } from '../../../utils/context';
import storageHelper from '../../../utils/storageHelper';
import MarkupWrapper from './MarkupWrapper';
import styles from '../shared/AuthScreen.module.scss';
import { LOGIN_SUCCESS } from '../../../context/actionTypes';
import { GlobalContext } from '../../../context/Provider';
import logoutUser from '../../../context/actions/logoutUser';


const LoginScreen = () => {
  let navigate = useNavigate();
  const [state, setState] = useState({
                                        username: '',
                                        password: '',
                                        error: null,
                                      }
                                    );

  console.log('state',state)

  const {
    authDispatch,
    authState: {error, loading},
  } = useContext(GlobalContext);


  const handleInputChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
    console.log(state)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(state)

    axios.post('http://127.0.0.1:8080/api/auth/login', {
      username: state.username,
      password: state.password,
    })
      .then((response) => {
        console.log('setuser responsedata',response.data)
        storageHelper.setData({
          user: response.data,
          username: response.data.username,
          token: response.data.token,
        });
        

        // logoutUser()(authDispatch)

        authDispatch({
          type: LOGIN_SUCCESS,
          payload: response.data,
        });
        
        navigate('/');

        axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

        // context.setUser(response.data.user);


        
      }, (error) => {
        const isValidationError = error.response.status >= 400 && error.response.status < 500;
        if (isValidationError) {
          setState({ error: error.response.data.error });
        } else {
          // eslint-disable-next-line no-alert
          window.alert(error);
        }
      });
  }

  
  return (
    <MarkupWrapper>
      <form onSubmit={handleSubmit}>
        <input type="text" value={state.username} onChange={handleInputChange} name="username" placeholder="Username" required />
        <input type="password" value={state.password} onChange={handleInputChange} name="password" placeholder="Password" required />
        <div className={styles['button-box']}>
          <button className="btn btn--inverted">Sign in</button>
        </div>
        {/* {state.error && errorBox} */}
      </form>
    </MarkupWrapper>
  );
  
}

LoginScreen.propTypes = {
  context: contextShape.isRequired,
};

export default withRouter(LoginScreen);
