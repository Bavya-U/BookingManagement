import {
  FETCH_SERVICES_REQUEST,
  FETCH_SERVICES_SUCCESS,
  FETCH_SERVICES_FAIL,
  ADD_SERVICE_SUCCESS,
  DELETE_SERVICE_SUCCESS,
} from "../actions/serviceAction";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export const serviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SERVICES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SERVICES_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case FETCH_SERVICES_FAIL:
      return { ...state, loading: false, error: action.payload };
    case ADD_SERVICE_SUCCESS:
      return { ...state, list: [...state.list, action.payload] };
    case DELETE_SERVICE_SUCCESS:
      return { ...state, list: state.list.filter(s => s.id !== action.payload) };
    default:
      return state;
  }
};
