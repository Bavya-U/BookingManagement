// src/redux/actions/bookingActions.js
import { db, auth } from "../../firebase";
import { collection, getDocs, addDoc, query, where, doc, setDoc ,getDoc,deleteDoc,} from "firebase/firestore";

export const FETCH_SERVICES = "FETCH_SERVICES";
export const FETCH_SLOTS = "FETCH_SLOTS";
export const ADD_BOOKING = "ADD_BOOKING";
export const BOOKING_ERROR = "BOOKING_ERROR";

export const FETCH_BOOKINGS_REQUEST = "FETCH_BOOKINGS_REQUEST";
export const FETCH_BOOKINGS_SUCCESS = "FETCH_BOOKINGS_SUCCESS";
export const FETCH_BOOKINGS_FAIL = "FETCH_BOOKINGS_FAIL";

export const CANCEL_BOOKING_SUCCESS = "CANCEL_BOOKING_SUCCESS";
export const CANCEL_BOOKING_FAIL = "CANCEL_BOOKING_FAIL";

export const FETCH_BOOKINGID_REQUEST = "FETCH_BOOKINGID_REQUEST";
export const FETCH_BOOKINGID_SUCCESS = "FETCH_BOOKINGID_SUCCESS";
export const FETCH_BOOKINGID_FAIL = "FETCH_BOOKINGID_FAIL";
// Fetch services
export const fetchServices = () => async (dispatch) => {
  try {
    const snapshot = await getDocs(collection(db, "services"));
    const services = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    dispatch({ type: FETCH_SERVICES, payload: services });
  } catch (error) {
    dispatch({ type: BOOKING_ERROR, payload: error.message });
  }
};

// Fetch slots
export const fetchSlots = (serviceId, date) => async (dispatch) => {
  try {
    const q = query(
      collection(db, "time_slots"),
      where("service_id", "==", serviceId),
      where("date", "==", date),
      where("isBooked", "==", false)
    );
    const snapshot = await getDocs(q);
    const slots = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    dispatch({ type: FETCH_SLOTS, payload: slots });
  } catch (error) {
    dispatch({ type: BOOKING_ERROR, payload: error.message });
  }
};

// Add booking
export const addBooking = ({ serviceId, date, slot, name, email, phone }, navigate) => async (dispatch, getState) => {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      user_id: auth.currentUser.uid,
      service_id: serviceId,
      date,
      slot,
      customerName: name,
      email,
      phone,
    });

    // Mark slot booked
    const state = getState();
    const slotDoc = state.booking.slots.find((s) => s.slot === slot);
    if (slotDoc) {
      await setDoc(doc(db, "time_slots", slotDoc.id), { ...slotDoc, isBooked: true });
    }

    dispatch({ type: ADD_BOOKING, payload: docRef.id });
    navigate(`/resident-dashboard/booking-confirmation/${docRef.id}`);
  } catch (error) {
    dispatch({ type: BOOKING_ERROR, payload: error.message });
  }
};

export const fetchBookings = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_BOOKINGS_REQUEST });
  try {
    const q = query(collection(db, "bookings"), where("user_id", "==", userId));
    const snap = await getDocs(q);

    const data = await Promise.all(
      snap.docs.map(async (d) => {
        const booking = { id: d.id, ...d.data() };
        if (booking.service_id) {
          const serviceRef = doc(db, "services", booking.service_id);
          const serviceSnap = await getDoc(serviceRef);
          if (serviceSnap.exists()) booking.serviceName = serviceSnap.data().name;
        }
        return booking;
      })
    );

    dispatch({ type: FETCH_BOOKINGS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_BOOKINGS_FAIL, payload: err.message });
  }
};

// ✅ Action creator: cancel booking
export const cancelBooking = (id) => async (dispatch) => {
  try {
    await deleteDoc(doc(db, "bookings", id));
    dispatch({ type: CANCEL_BOOKING_SUCCESS, payload: id });
  } catch (err) {
    dispatch({ type: CANCEL_BOOKING_FAIL, payload: err.message });
  }
};
export const fetchBookingById = (bookingId) => async (dispatch) => {
  dispatch({ type: FETCH_BOOKINGID_REQUEST });
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
      throw new Error("Booking not found");
    }

    const bookingData = { id: bookingId, ...bookingSnap.data() };

    // fetch service name also
    let serviceName = "";
    if (bookingData.service_id) {
      const serviceRef = doc(db, "services", bookingData.service_id);
      const serviceSnap = await getDoc(serviceRef);
      if (serviceSnap.exists()) {
        serviceName = serviceSnap.data().name || "";
      }
    }

    dispatch({
      type: FETCH_BOOKINGID_SUCCESS,
      payload: { booking: bookingData, serviceName },
    });
  } catch (error) {
    dispatch({ type: FETCH_BOOKINGID_FAIL, payload: error.message });
  }
};
