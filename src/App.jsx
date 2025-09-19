// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "primeicons/primeicons.css";

import Layout from "./layout/layout";
import ResidentDashboard from "./pages/resident/residentDashboard";
import AdminDashboard from "./pages/admin/adminDashboard";
import ResidentBooking from "./pages/resident/residentBooking";
import ResidentMyBookings from "./pages/resident/residentMyBooking";
import BookingConfirmation from "./pages/resident/bookingConfirmation";
import AdminSlotManagement from "./pages/admin/adminSlotManagement";
import AdminServiceManagement from "./pages/admin/adminServiceManagement";
import AdminAllBookings from "./pages/admin/allBooking";
import { Loader } from "./components/loader";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Loader />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Resident Dashboard - Protected */}
        <Route
          path="/resident-dashboard"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<ResidentDashboard />} />
          <Route path="resident-booking" element={<ResidentBooking />} />
          <Route path="resident-my-bookings" element={<ResidentMyBookings />} />
          <Route
            path="booking-confirmation/:bookingId"
            element={<BookingConfirmation />}
          />
        </Route>

        {/* Admin Dashboard - Protected */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="admin-slot-management" element={<AdminSlotManagement />} />
          <Route path="admin-service-management" element={<AdminServiceManagement />} />
          <Route path="admin-bookings" element={<AdminAllBookings />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" />
    </Router>
  );
}

export default App;
