import React, {useContext, useEffect, useRef, useState,useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import queryString from 'query-string';
import { withRouter } from '../../../hooks/withRouter';
import { contextShape } from '../../../utils/context';
import storageHelper from '../../../utils/storageHelper';
import MarkupWrapper from './MarkupWrapper';
import { Link,useNavigate } from 'react-router-dom';
import { LOGIN_SUCCESS } from '../../../context/actionTypes';
import { GlobalContext } from '../../../context/Provider';

import styles from '../shared/AuthScreen.module.scss';

const RegisterScreen = () => {
  let navigate = useNavigate();
  const [state, setState] = useState({
                                      username: '',
                                      password: '',
                                      confirmPassword: '',
                                      error: null,
                                      }
                                    );

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

    axios.post('http://127.0.0.1:8080/api/auth/register', {
      username: state.username,
      password: state.password,
      confirmPassword: state.confirmPassword,
    })
      .then((response) => {
        storageHelper.setData({
          user: response.data.user,
          token: response.data.token,
        });

        authDispatch({
          type: LOGIN_SUCCESS,
          payload: response.data,
        });
        
        navigate('/');

        axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
      
        // this.props.context.setUser(response.data.user);

      }, (error) => {
        const isValidationError = error.response.status >= 400 && error.response.status < 500;
        if (isValidationError) {
          // this.setState({ error: error.response.data.error });
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
        <input type="password" value={state.confirmPassword} onChange={handleInputChange} name="confirmPassword" placeholder="Confirm Password" required />
        <div className={styles['button-box']}>
          <button className="btn btn--inverted">Sign up</button>
        </div>
      </form>
    </MarkupWrapper>
  );
}

RegisterScreen.propTypes = {
  context: contextShape.isRequired,
};

export default withRouter(RegisterScreen);
