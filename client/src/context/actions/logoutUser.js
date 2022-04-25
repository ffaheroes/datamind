import { LOGOUT_USER } from '../actionTypes';

export default () => (dispatch) => {
  dispatch({
    type: LOGOUT_USER,
  });
};