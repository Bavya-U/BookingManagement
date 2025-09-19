import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookings,
  cancelBooking,
} from "../../redux/actions/bookingAction";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

const ResidentMyBookings = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const dispatch = useDispatch();
  const { list: booking = [], loading } = useSelector(
    (state) => state.booking || {}
  );

  // Watch auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        dispatch(fetchBookings(u.uid));
      }
    });
    return () => unsub();
  }, [dispatch]);

  const handleCancel = (id) => {
    if (window.confirm("Cancel this booking?")) {
      dispatch(cancelBooking(id));
    }
  };

  // ✅ Filter bookings
  const filteredBookings = booking.filter(
    (b) =>
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (b.serviceName || b.service_id)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      b.date.toLowerCase().includes(search.toLowerCase()) ||
      b.slot.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Sort bookings dynamically
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let valA = a[sortColumn] || "";
    let valB = b[sortColumn] || "";

    // Date handling
    if (sortColumn === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    // String/Number handling
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // ✅ Pagination logic
  const totalPages = Math.ceil(sortedBookings.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentBookings = sortedBookings.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // ✅ Handle column sort click
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 animate-pulse">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card className="shadow-xl border border-gray-200 rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            My Bookings
          </CardTitle>
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg"
            />
          </div>
        </CardHeader>
        <CardContent>
          {currentBookings?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 text-lg">No matching bookings found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <Table className="min-w-full text-sm">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead
                        className="px-4 py-3 text-left text-gray-600 font-semibold cursor-pointer select-none"
                        onClick={() => handleSort("id")}
                      >
                        Customer Name
                        <ArrowUpDown className="inline w-4 h-4 ml-1 text-gray-400" />
                      </TableHead>
                      <TableHead
                        className="px-4 py-3 text-left text-gray-600 font-semibold cursor-pointer select-none"
                        onClick={() => handleSort("serviceName")}
                      >
                        Service
                        <ArrowUpDown className="inline w-4 h-4 ml-1 text-gray-400" />
                      </TableHead>
                      <TableHead
                        className="px-4 py-3 text-left text-gray-600 font-semibold cursor-pointer select-none"
                        onClick={() => handleSort("date")}
                      >
                        Date
                        <ArrowUpDown className="inline w-4 h-4 ml-1 text-gray-400" />
                      </TableHead>
                      <TableHead
                        className="px-4 py-3 text-left text-gray-600 font-semibold cursor-pointer select-none"
                        onClick={() => handleSort("slot")}
                      >
                        Slot
                        <ArrowUpDown className="inline w-4 h-4 ml-1 text-gray-400" />
                      </TableHead>
                      <TableHead className="px-4 py-3 text-center text-gray-600 font-semibold">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBookings.map((b, idx) => (
                      <TableRow
                        key={b.id}
                        className={`${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-100 transition`}
                      >
                        <TableCell className="px-4 py-3 font-mono text-sm text-gray-700">
                          {b.customerName}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-800">
                          {b.serviceName || b.service_id}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-700">
                          {b.date}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-700">
                          {b.slot}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded shadow-sm hover:scale-105 transition"
                            onClick={() => handleCancel(b.id)}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* ✅ Pagination */}
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Button>

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentMyBookings;
