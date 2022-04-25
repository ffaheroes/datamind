import React, {createContext, useReducer,useEffect} from 'react';
import authInitialState from './initialStates/authState';
import auth from './reducers/auth';

const localState = JSON.parse(localStorage.getItem("authcontent"));

export const GlobalContext = createContext({});

const GlobalProvider = ({children}) => {
  const [authState, authDispatch] = useReducer(auth, localState || authInitialState);

  useEffect(() => {
    localStorage.setItem("authcontent", JSON.stringify(authState));
  }, [authState]);

  return (
    <GlobalContext.Provider
      value={{authState, authDispatch}}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;