import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { format } from "date-fns";
import { toast } from "react-toastify";

// Action Types
export const FETCH_SLOTS_REQUEST = "FETCH_SLOTS_REQUEST";
export const FETCH_SLOTS_SUCCESS = "FETCH_SLOTS_SUCCESS";
export const FETCH_SLOTS_FAIL = "FETCH_SLOTS_FAIL";

export const ADD_SLOT_SUCCESS = "ADD_SLOT_SUCCESS";
export const DELETE_SLOT_SUCCESS = "DELETE_SLOT_SUCCESS";

// Fetch slots
export const fetchSlots = (serviceId, date) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SLOTS_REQUEST });
    const q = query(
      collection(db, "time_slots"),
      where("service_id", "==", serviceId),
      where("date", "==", format(date, "yyyy-MM-dd"))
    );
    const snap = await getDocs(q);
    const slots = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    dispatch({ type: FETCH_SLOTS_SUCCESS, payload: slots });
  } catch (err) {
    dispatch({ type: FETCH_SLOTS_FAIL, payload: err.message });
    toast.error("Failed to fetch slots");
  }
};

// Add slot with duplicate check
export const addSlot = (serviceId, date, slot) => async (dispatch) => {
  try {
    // Check duplicate slot
    const q = query(
      collection(db, "time_slots"),
      where("service_id", "==", serviceId),
      where("date", "==", format(date, "yyyy-MM-dd")),
      where("slot", "==", slot)
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      toast.error("This slot already exists for the selected service and date!");
      return;
    }

    await addDoc(collection(db, "time_slots"), {
      service_id: serviceId,
      date: format(date, "yyyy-MM-dd"),
      slot,
      isBooked: false,
    });

    dispatch({ type: ADD_SLOT_SUCCESS });
    dispatch(fetchSlots(serviceId, date));
    toast.success("Slot added successfully!");
  } catch (err) {
    console.error("Add slot failed", err);
    toast.error("Failed to add slot. Try again!");
  }
};

// Delete slot
export const deleteSlot = (id, serviceId, date) => async (dispatch) => {
  try {
    await deleteDoc(doc(db, "time_slots", id));
    dispatch({ type: DELETE_SLOT_SUCCESS });
    dispatch(fetchSlots(serviceId, date));
    toast.success("Slot deleted successfully!");
  } catch (err) {
    console.error("Delete slot failed", err);
    toast.error("Failed to delete slot. Try again!");
  }
};



// // src/redux/slotActions.js
// import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
// import { db } from "../../firebase";
// import { format } from "date-fns";

// // Action Types
// export const FETCH_SLOTS_REQUEST = "FETCH_SLOTS_REQUEST";
// export const FETCH_SLOTS_SUCCESS = "FETCH_SLOTS_SUCCESS";
// export const FETCH_SLOTS_FAIL = "FETCH_SLOTS_FAIL";

// export const ADD_SLOT_SUCCESS = "ADD_SLOT_SUCCESS";
// export const DELETE_SLOT_SUCCESS = "DELETE_SLOT_SUCCESS";

// // Action Creators
// export const fetchSlots = (serviceId, date) => async (dispatch) => {
//   try {
//     dispatch({ type: FETCH_SLOTS_REQUEST });
//     const q = query(
//       collection(db, "time_slots"),
//       where("service_id", "==", serviceId),
//       where("date", "==", format(date, "yyyy-MM-dd"))
//     );
//     const snap = await getDocs(q);
//     const slots = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//     dispatch({ type: FETCH_SLOTS_SUCCESS, payload: slots });
//   } catch (err) {
//     dispatch({ type: FETCH_SLOTS_FAIL, payload: err.message });
//   }
// };

// // export const addSlot = (serviceId, date, slot) => async (dispatch) => {
// //   try {
// //     await addDoc(collection(db, "time_slots"), {
// //       service_id: serviceId,
// //       date: format(date, "yyyy-MM-dd"),
// //       slot,
// //       isBooked: false,
// //     });
// //     dispatch({ type: ADD_SLOT_SUCCESS });
// //     dispatch(fetchSlots(serviceId, date));
// //   } catch (err) {
// //     console.error("Add slot failed", err);
// //   }
// // };
// export const addSlot = (serviceId, date, slot) => async (dispatch) => {
//   try {
//     // Step 1: Check if the slot already exists
//     const q = query(
//       collection(db, "time_slots"),
//       where("service_id", "==", serviceId),
//       where("date", "==", format(date, "yyyy-MM-dd")),
//       where("slot", "==", slot)
//     );
//     const snap = await getDocs(q);

//     if (!snap.empty) {
//       alert("This slot already exists for the selected service and date!");
//       return;
//     }

//     // Step 2: Add the slot if it doesn't exist
//     await addDoc(collection(db, "time_slots"), {
//       service_id: serviceId,
//       date: format(date, "yyyy-MM-dd"),
//       slot,
//       isBooked: false,
//     });

//     dispatch({ type: ADD_SLOT_SUCCESS });
//     dispatch(fetchSlots(serviceId, date));
//   } catch (err) {
//     console.error("Add slot failed", err);
//   }
// };

// export const deleteSlot = (id, serviceId, date) => async (dispatch) => {
//   try {
//     await deleteDoc(doc(db, "time_slots", id));
//     dispatch({ type: DELETE_SLOT_SUCCESS });
//     dispatch(fetchSlots(serviceId, date));
//   } catch (err) {
//     console.error("Delete slot failed", err);
//   }
// };
