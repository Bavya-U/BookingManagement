import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

// Action types
export const FETCH_BOOKINGS_REQUEST = "FETCH_BOOKINGS_REQUEST";
export const FETCH_BOOKINGS_SUCCESS = "FETCH_BOOKINGS_SUCCESS";
export const FETCH_BOOKINGS_FAIL = "FETCH_BOOKINGS_FAIL";

export const CANCEL_BOOKING_REQUEST = "CANCEL_BOOKING_REQUEST";
export const CANCEL_BOOKING_SUCCESS = "CANCEL_BOOKING_SUCCESS";
export const CANCEL_BOOKING_FAIL = "CANCEL_BOOKING_FAIL";

// Fetch bookings
export const fetchBookings = () => async (dispatch) => {
  dispatch({ type: FETCH_BOOKINGS_REQUEST });
  try {
    const snap = await getDocs(collection(db, "bookings"));

    const data = await Promise.all(
      snap.docs.map(async (d) => {
        const booking = { id: d.id, ...d.data() };
        if (booking.service_id) {
          const serviceRef = doc(db, "services", booking.service_id);
          const serviceSnap = await getDoc(serviceRef);
          if (serviceSnap.exists())
            booking.serviceName = serviceSnap.data().name;
        }
        return booking;
      })
    );

    dispatch({ type: FETCH_BOOKINGS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_BOOKINGS_FAIL, payload: error.message });
  }
};

// Cancel booking
export const cancelBooking = (id) => async (dispatch) => {
  dispatch({ type: CANCEL_BOOKING_REQUEST });
  try {
    await deleteDoc(doc(db, "bookings", id));
    dispatch({ type: CANCEL_BOOKING_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: CANCEL_BOOKING_FAIL, payload: error.message });
  }
};
