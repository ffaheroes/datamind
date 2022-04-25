import {
  CLEAR_AUTH_STATE,
  LOGIN_FAIL,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  ADD_SERIES,
  REGISTER_FAIL,
  REGISTER_LOADING,
  REGISTER_SUCCESS} from '../actionTypes'
import authInitialState from '../initialStates/authState'

const auth = (state=authInitialState, {type, payload}) => {
  switch (type) {
    case LOGIN_LOADING:
    case REGISTER_LOADING:
      return {
        ...state,
        loading: true,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        authdata: payload,
      };

    case LOGIN_SUCCESS:
      console.log('Reducer/auth/LOGIN_SUCCESS')
      return state = {
        ...state,
        loading: false,
        authdata: payload,
        isLoggedIn: true,
      };

    case ADD_SERIES:
      console.log('Reducer/auth/ADD_SERIES')
      return state = {
        ...state,
        loading: false,
        authdata: {
                    avatarUrl : state.authdata.avatarUrl,
                    token : state.authdata.token,
                    user_id : state.authdata.user_id,
                    username : state.authdata.username,
                    series : [...state.authdata.series,payload]
                  },
        isLoggedIn: true,
      };

    case LOGOUT_USER:
      console.log('reducer logout user')
      return {
        ...state,
        loading: false,
        authdata: null,
        isLoggedIn: false,
      };

    case REGISTER_FAIL:
    case LOGIN_FAIL:
      console.log('Reducer/auth/LOGIN_FAIL')
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case CLEAR_AUTH_STATE:
      return {
        ...state,
        loading: false,
        authdata: null,
        error: null,
      };

    default:
      console.log('Reducer/auth/default')
      return state;
  }
};

export default auth;