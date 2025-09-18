import { FETCH_SERVICES, FETCH_SLOTS, ADD_BOOKING, BOOKING_ERROR,  FETCH_BOOKINGS_REQUEST,
  FETCH_BOOKINGS_SUCCESS,
  FETCH_BOOKINGS_FAIL,
  CANCEL_BOOKING_SUCCESS,
  CANCEL_BOOKING_FAIL, 
 FETCH_BOOKINGID_REQUEST,
  FETCH_BOOKINGID_SUCCESS,
  FETCH_BOOKINGID_FAIL,} from "../actions/bookingAction";

const initialState = {
  services: [],
  slots: [],
  bookingId: null,
  error: null,
  list: [],
    bookingID: null,
  serviceName: "",
};

export const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SERVICES:
      return { ...state, services: action.payload };
    case FETCH_SLOTS:
      return { ...state, slots: action.payload };
    case ADD_BOOKING:
      return { ...state, bookingId: action.payload };
    case BOOKING_ERROR:
      return { ...state, error: action.payload };

       case FETCH_BOOKINGS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_BOOKINGS_SUCCESS:
      return { ...state, loading: false, list: action.payload };

    case FETCH_BOOKINGS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case CANCEL_BOOKING_SUCCESS:
      return {
        ...state,
        list: state.list.filter((b) => b.id !== action.payload),
      };

    case CANCEL_BOOKING_FAIL:
      return { ...state, error: action.payload };
      case FETCH_BOOKINGID_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_BOOKINGID_SUCCESS:
      return {
        ...state,
        loading: false,
        booking: action.payload.booking,
        serviceName: action.payload.serviceName,
      };
    case FETCH_BOOKINGID_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
