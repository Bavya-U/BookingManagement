import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

// Action Types
export const FETCH_SERVICES_REQUEST = "FETCH_SERVICES_REQUEST";
export const FETCH_SERVICES_SUCCESS = "FETCH_SERVICES_SUCCESS";
export const FETCH_SERVICES_FAIL = "FETCH_SERVICES_FAIL";

export const ADD_SERVICE_SUCCESS = "ADD_SERVICE_SUCCESS";
export const DELETE_SERVICE_SUCCESS = "DELETE_SERVICE_SUCCESS";

// Fetch Services
export const fetchServices = () => async (dispatch) => {
  dispatch({ type: FETCH_SERVICES_REQUEST });
  try {
    const snap = await getDocs(collection(db, "services"));
    const services = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    dispatch({ type: FETCH_SERVICES_SUCCESS, payload: services });
  } catch (error) {
    dispatch({ type: FETCH_SERVICES_FAIL, payload: error.message });
    toast.error("Failed to fetch services");
  }
};

// Add Service
export const addService = (name, description) => async (dispatch) => {
  try {
    const docRef = await addDoc(collection(db, "services"), { name, description });
    dispatch({
      type: ADD_SERVICE_SUCCESS,
      payload: { id: docRef.id, name, description },
    });
    toast.success("Service added successfully!"); // Success toast
  } catch (error) {
    console.error(error);
    toast.error("Failed to add service"); // Error toast
  }
};

// Delete Service
export const deleteService = (id) => async (dispatch) => {
  try {
    await deleteDoc(doc(db, "services", id));
    dispatch({ type: DELETE_SERVICE_SUCCESS, payload: id });
    toast.success("Service deleted successfully!"); // Success toast
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete service"); // Error toast
  }
};
