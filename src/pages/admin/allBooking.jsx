import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

const AdminAllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // ✅ Fetch bookings with service name
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
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

        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success("Booking cancelled successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel booking");
    }
  };

  // ✅ Filter bookings
  const filteredBookings = bookings.filter(
    (b) =>
      (b.customerName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (b.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.serviceName || b.service_id || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (b.date || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.slot || "").toLowerCase().includes(search.toLowerCase())
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

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // ✅ Pagination
  const totalPages = Math.ceil(sortedBookings.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentBookings = sortedBookings.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  if (loading)
    return (
      <p className="text-center py-8 text-gray-500 animate-pulse">
        Loading bookings...
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="shadow-xl border border-gray-200 rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            All Bookings
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
        <CardContent className="overflow-x-auto">
          {currentBookings.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              No bookings found.
            </p>
          ) : (
            <>
              <Table className="min-w-full">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead
                      className="px-4 py-3 text-left cursor-pointer select-none"
                      onClick={() => handleSort("customerName")}
                    >
                      Customer Name
                      <ArrowUpDown className="inline w-4 h-4 ml-1 text-gray-400" />
                    </TableHead>
                    <TableHead
                      className="px-4 py-3 text-left cursor-pointer select-none"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      <ArrowUpDown className="inline w-4 h-4 ml-1 text-gray-400" />
                    </TableHead>
                    <TableHead
                      className="px-4 py-3 text-left cursor-pointer select-none"
                      onClick={() => handleSort("serviceName")}
                    >
                      Service
                      <ArrowUpDown className="inline w-4 h-4 ml-1 text-gray-400" />
                    </TableHead>
                    <TableHead
                      className="px-4 py-3 text-left cursor-pointer select-none"
                      onClick={() => handleSort("date")}
                    >
                      Date
                      <ArrowUpDown className="inline w-4 h-4 ml-1 text-gray-400" />
                    </TableHead>
                    <TableHead
                      className="px-4 py-3 text-left cursor-pointer select-none"
                      onClick={() => handleSort("slot")}
                    >
                      Slot
                      <ArrowUpDown className="inline w-4 h-4 ml-1 text-gray-400" />
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center">Action</TableHead>
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
                      <TableCell className="px-4 py-3">{b.customerName}</TableCell>
                      <TableCell className="px-4 py-3">{b.email}</TableCell>
                      <TableCell className="px-4 py-3">{b.serviceName || b.service_id}</TableCell>
                      <TableCell className="px-4 py-3">{b.date}</TableCell>
                      <TableCell className="px-4 py-3">{b.slot}</TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-lg shadow-sm hover:scale-105 transition"
                          onClick={() => cancelBooking(b.id)}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
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
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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

export default AdminAllBookings;