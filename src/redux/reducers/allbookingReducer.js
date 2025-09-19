import {
  FETCH_BOOKINGS_REQUEST,
  FETCH_BOOKINGS_SUCCESS,
  FETCH_BOOKINGS_FAIL,
  CANCEL_BOOKING_REQUEST,
  CANCEL_BOOKING_SUCCESS,
  CANCEL_BOOKING_FAIL,
} from "../actions/allBookingAction";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export const allbookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BOOKINGS_REQUEST:
    case CANCEL_BOOKING_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_BOOKINGS_SUCCESS:
      return { ...state, loading: false, list: action.payload };

    case CANCEL_BOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
        list: state.list.filter((b) => b.id !== action.payload),
      };

    case FETCH_BOOKINGS_FAIL:
    case CANCEL_BOOKING_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
