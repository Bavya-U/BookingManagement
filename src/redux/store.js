import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/reducers/authReducer";
import { bookingReducer } from "../redux/reducers/bookingReducer";
import slotReducer from "./reducers/slotReducer";
import { serviceReducer } from "./reducers/serviceReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
     slots: slotReducer,
     services: serviceReducer,
  },
});

export default store;
