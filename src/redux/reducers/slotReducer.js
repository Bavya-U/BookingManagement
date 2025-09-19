// src/redux/slotReducer.js
import {
  FETCH_SLOTS_REQUEST,
  FETCH_SLOTS_SUCCESS,
  FETCH_SLOTS_FAIL,
  ADD_SLOT_SUCCESS,
  DELETE_SLOT_SUCCESS,
} from "../actions/slotAction";

const initialState = {
  loading: false,
  list: [],
  error: null,
};

export default function slotReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SLOTS_REQUEST:
      return { ...state, loading: true };
    case FETCH_SLOTS_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case FETCH_SLOTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case ADD_SLOT_SUCCESS:
    case DELETE_SLOT_SUCCESS:
      return state; 
    default:
      return state;
  }
}
