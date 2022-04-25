
import {
  CREATE_ALERT_FAIL,
  CREATE_ALERT_LOADING,
  CREATE_ALERT_SUCCESS,
  DEL_ALERT_LOADING,
  DEL_ALERT_SUCCESS,
  GET_ALERT_FAIL,
  GET_ALERT_LOADING,
  GET_ALERT_SUCCESS,
  GET_ALERT_REFRESHING,
  GET_MYLIST_SUCCESS,
  EDIT_ALERT_LOADING,
  EDIT_ALERT_SUCCESS,
  EDIT_ALERT_FAIL,
  MYLIST_EXECUTE_LOADING,
  MYLIST_EXECUTE_SUCCESS,
  ADD_ALERT_TO_MYLIST,
  GET_MYLIST_LOADING,
  CLEAR_MYLIST,
} from '../actionTypes';

const alert = (state, {type, payload}) => {
  switch (type) {
    case EDIT_ALERT_LOADING: {
      return {
        ...state,
        createAlert: {
          ...state.createAlert,
          loading: true,
          error: null,
        },
      };
    }

    case EDIT_ALERT_SUCCESS: {
      return {
        ...state,
        createAlert: {
          ...state.createAlert,
          loading: false,
          error: null,
        },

        getAlert: {
          ...state.getAlert,
          loading: false,
          data: state.getAlert.data.map((item) => {
            if (item.name === payload.name) {
              return payload;
            } else {
              return item;
            }
          }),

          refreshing : state.getAlert.refreshing.filter((item) => item!== payload.name),

          error: null,
        },
      };
    }

    case EDIT_ALERT_FAIL: {
      return {
        ...state,
        createAlert: {
          ...state.createAlert,
          loading: false,
          error: null,
        },
      };
    }

    case DEL_ALERT_LOADING: {
      return {
        ...state,
        deleteAlert: {
          ...state.deleteAlert,
          loading: false,
          error: null,
        },

        getAlert: {
          ...state.getAlert,
          loading: false,
          mylist: state.getAlert.mylist.filter((item) => item.symbol !== payload.symbol),
          error: null,
        },
      };
    }

    case DEL_ALERT_SUCCESS: {
      return {
        ...state,
        deleteAlert: {
          ...state.deleteAlert,
          loading: false,
          error: null,
        },

        getAlert: {
          ...state.getAlert,
          loading: false,
          mylist: state.getAlert.mylist.filter((item) => item.symbol !== payload.symbol),
          error: null,
        },
      };
    }

    case CREATE_ALERT_FAIL:
      return {
        ...state,
        createAlert: {
          ...state.createAlert,
          loading: false,
          error: null,
        },
      };

    case CREATE_ALERT_LOADING:
      return {
        ...state,
        getAlert: {
          ...state.getAlert,
          loading: false,
          type: CREATE_ALERT_SUCCESS,
          mylist : [...state.getAlert.mylist,{name : payload.name,loadingitem : true,symbol:payload.symbol,agg_alertscore:[0]}],
          error: null,
        },
      };


      case ADD_ALERT_TO_MYLIST:
        return {
          ...state,
          getAlert: {
            ...state.getAlert,
            loading: false,
            type: CREATE_ALERT_SUCCESS,
            mylist : [...state.getAlert.mylist,{name : payload.name.name,loadingitem : false,symbol:payload.symbol,cg_id:payload.cg_id,agg_alertscore:payload.agg_alertscore}],
            error: null,
          },
        };

    case CREATE_ALERT_SUCCESS:
      return {
        ...state,
        getAlert: {
          ...state.getAlert,
          loading: false,
                    mylist: state.getAlert.mylist.map((item) => {
            if (item.name === payload.name) {
              item.loadingitem=false;
              return item;
            } else {
              return item;
            }
          }),
          error: null,
        },
      };

    case CREATE_ALERT_FAIL:
      return {
        ...state,
        createAlert: {
          ...state.createAlert,
          loading: false,
          error: payload,
        },
      };

    case GET_ALERT_LOADING:
      return {
        ...state,
        getAlert: {
          ...state.getAlert,
          loading: true,
          error: null,
        },
      };

      case GET_ALERT_REFRESHING:
        return {
          ...state,
          getAlert: {
            ...state.getAlert,
            refreshing: [...state.getAlert.refreshing,payload],
          },
        };

    case GET_ALERT_SUCCESS:
      return {
        ...state,
        getAlert: {
          ...state.getAlert,
          loading: false,
          data: payload,
          error: null,
        },
      };



      case GET_MYLIST_LOADING:
        return {
          ...state,
          getAlert: {
            ...state.getAlert,
            loading: true,
            error: null,
          },
        };

    case GET_MYLIST_SUCCESS:
      return {
        ...state,
        getAlert: {
          ...state.getAlert,
          loading: false,
          mylist: payload,
          error: null,
        },
      };

    case MYLIST_EXECUTE_LOADING:
      console.log('reducer MYLIST_EXECUTE_LOADING',payload);
      return {
        ...state,
        getAlert: {
          ...state.getAlert,
          loading: false,
          mylist: state.getAlert.mylist.map((item) => {
            if (item.name === payload) {
              item.loadingitem=true;
              console.log('reducer MYLIST_EXECUTE_LOADING item',item);
              return item;
            } else {
              return item;
            }
          }),
          error: null,
        },
      };

      case MYLIST_EXECUTE_SUCCESS:
        console.log('reducer MYLIST_EXECUTE_SUCCESS',payload);
        return {
          ...state,
          getAlert: {
            ...state.getAlert,
            loading: false,
            mylist: payload,
            error: null,
          },
        };
      
      
        case CLEAR_MYLIST:
          console.log('reducer CLEAR MY LIST');
          return {
            ...state,
            getAlert: {
              ...state.getAlert,
              loading: false,
              mylist: [],
              error: null,
            },
          };


    case GET_ALERT_FAIL:
      return {
        ...state,
        getAlert: {
          ...state.getAlert,
          loading: false,
          error: payload,
        },
      };

    default:
      return state;
  }
};

export default alert;
