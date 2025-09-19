import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingById } from "../../redux/actions/bookingAction";

// ✅ ShadCN UI
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ✅ Icons
import { CheckCircle, Copy, Printer } from "lucide-react";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, booking, serviceName, error } = useSelector(
    (state) => state.booking
  );

  const [user, setUser] = useState(null);

  // ✅ Protect page
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate("/login");
      } else {
        setUser(u);
      }
    });
    return () => unsub();
  }, [navigate]);

  // ✅ Fetch booking from Redux
  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingById(bookingId));
    }
  }, [bookingId, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-muted-foreground text-lg">Loading your booking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 to-red-100">
        <p className="text-red-500 text-center font-semibold">{error}</p>
      </div>
    );
  }

  if (!booking) return null;

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(bookingId);
      alert("Booking ID copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-teal-100">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Booking Confirmed!
          </CardTitle>
          <p className="text-sm text-gray-500">Thank you for booking with us 🎉</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Booking ID */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge
              variant="secondary"
              className="text-sm px-3 py-1 bg-indigo-100 text-indigo-800 font-mono"
            >
              ID: {bookingId}
            </Badge>
            <Button size="sm" variant="outline" onClick={copyId} className="gap-1">
              <Copy className="w-4 h-4" /> Copy
            </Button>
            <Button size="sm" variant="outline" onClick={handlePrint} className="gap-1">
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>

          {/* Booking Details */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm md:text-base ">
            <div className="bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-600">Name</p>
              <p className="text-gray-800">{booking.customerName || "—"}</p>
            </div>
            <div className="bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-600">Email</p>
              <p className="text-gray-800">{booking.email || "—"}</p>
            </div>
            <div className="bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-600">Phone</p>
              <p className="text-gray-800">{booking.phone || "—"}</p>
            </div>
            <div className="bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-600">Service</p>
              <p className="text-gray-800">{serviceName || booking.service_id}</p>
            </div>
            <div className="bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-600">Date</p>
              <p className="text-gray-800">{booking.date}</p>
            </div>
            <div className="bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-600">Time Slot</p>
              <p className="text-gray-800">{booking.slot}</p>
            </div>
          </div> */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm md:text-base">
  <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
    <p className="font-semibold text-gray-600">Name</p>
    <p className="text-gray-800">{booking.customerName || "—"}</p>
  </div>
  <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
    <p className="font-semibold text-gray-600">Email</p>
    <p className="text-gray-800">{booking.email || "—"}</p>
  </div>
  <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
    <p className="font-semibold text-gray-600">Phone</p>
    <p className="text-gray-800">{booking.phone || "—"}</p>
  </div>
  <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
    <p className="font-semibold text-gray-600">Service</p>
    <p className="text-gray-800">{serviceName || booking.service_id}</p>
  </div>
  <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
    <p className="font-semibold text-gray-600">Date</p>
    <p className="text-gray-800">{booking.date}</p>
  </div>
  <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
    <p className="font-semibold text-gray-600">Time Slot</p>
    <p className="text-gray-800">{booking.slot}</p>
  </div>
</div>

          {/* Go Back */}
          <div className="pt-2 flex justify-center">
            <Button
              onClick={() => navigate("/resident-dashboard/resident-booking")}
              className="w-full md:w-auto bg-[#2798b5] rounded hover:bg-[#35a7c7] text-white mb-4 hover:scale-105 transition text-white rounded-full px-6"
            >
              Go to Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmation;

