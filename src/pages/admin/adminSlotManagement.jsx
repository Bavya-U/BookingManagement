import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSlots,
  addSlot,
  deleteSlot,
} from "../../redux/actions/slotAction";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";

const formatTimeAMPM = (time24) => {
  if (!time24) return "";
  const [h, m] = time24.split(":");
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
};

const AdminSlotManagement = () => {
  const [services, setServices] = useState([]);
  const dispatch = useDispatch();
  const { list: slots } = useSelector((state) => state.slots);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [sortField, setSortField] = useState("slot");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchServices = async () => {
      const snap = await getDocs(collection(db, "services"));
      setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchServices();
  }, []);

  useEffect(() => setPage(1), [search]);

  const validationSchema = Yup.object({
    service: Yup.string().required("Required"),
    date: Yup.date().required("Required").nullable(),
    slot: Yup.string().required("Required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    dispatch(addSlot(values.service, values.date, values.slot));
    resetForm({
      values: {
        service: "",
        date: values.date,
        startTime: "",
        endTime: "",
        slot: "",
      },
    });
  };

  const handleDeleteSlot = (id, serviceId, date) => {
    if (window.confirm("Delete this slot?")) {
      dispatch(deleteSlot(id, serviceId, date));
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredSlots = slots.filter((s) =>
    s.slot.toLowerCase().includes(search.toLowerCase())
  );
  const sortedSlots = [...filteredSlots].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  const totalPages = Math.ceil(sortedSlots.length / pageSize);
  const paginatedSlots = sortedSlots.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const generateSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 21; hour++) {
      const startHour = hour;
      const endHour = hour + 1;
      const formatHour = (h) => {
        const ampm = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12;
        return `${hour12}:00 ${ampm}`;
      };
      slots.push(`${formatHour(startHour)} - ${formatHour(endHour)}`);
    }
    return slots;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Slot Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{
              service: "",
              date: new Date(),
              startTime: "",
              endTime: "",
              slot: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => {
              useEffect(() => {
                if (values.service && values.date) {
                  dispatch(fetchSlots(values.service, values.date));
                }
              }, [values.service, values.date, dispatch]);

              return (
                <Form className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-end w-full">
                    <div className="flex-1 flex flex-col w-full">
                      <label>
                        Service <span className="text-red-500">*</span>
                      </label>
                      <Field name="service">
                        {({ field, form }) => (
                          <Select
                            value={field.value || undefined}
                            onValueChange={(val) => {
                              form.setFieldValue("service", val);
                            }}
                          >
                            <SelectTrigger className="w-full h-10 rounded px-3">
                              <SelectValue placeholder="Select Service" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                  {s.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      <div className="h-5 text-red-500 text-sm">
                        <ErrorMessage name="service" />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col w-full">
                      <label>
                        Date <span className="text-red-500">*</span>
                      </label>
                      <Field name="date">
                        {({ field, form }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full rounded h-10 justify-start text-left"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(val) => {
                                  form.setFieldValue("date", val);
                                  form.setFieldTouched("date", true);
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      </Field>
                      <div className="h-5 text-red-500 text-sm">
                        <ErrorMessage name="date" />
                      </div>
                    </div>

                    {/* <div className="flex-1 flex flex-col w-full">
                      <label>
                        Slot <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Field name="startTime">
                          {({ field, form }) => (
                            <Input
                              type="time"
                              {...field}
                              className="h-10 w-full"
                              onChange={(e) => {
                                form.setFieldValue("startTime", e.target.value);
                                const start = formatTimeAMPM(e.target.value);
                                const end = form.values.endTime
                                  ? formatTimeAMPM(form.values.endTime)
                                  : "";
                                form.setFieldValue(
                                  "slot",
                                  end ? `${start} - ${end}` : start
                                );
                                form.setFieldTouched("slot", true);
                              }}
                            />
                          )}
                        </Field>
                        <span className="self-center hidden sm:block">to</span>
                        <Field name="endTime">
                          {({ field, form }) => (
                            <Input
                              type="time"
                              {...field}
                              className="h-10 w-full"
                              onChange={(e) => {
                                form.setFieldValue("endTime", e.target.value);
                                const start = form.values.startTime
                                  ? formatTimeAMPM(form.values.startTime)
                                  : "";
                                const end = formatTimeAMPM(e.target.value);
                                form.setFieldValue(
                                  "slot",
                                  start ? `${start} - ${end}` : end
                                );
                                form.setFieldTouched("slot", true);
                              }}
                            />
                          )}
                        </Field>
                      </div>
                      <div className="h-5 text-red-500 text-sm">
                        <ErrorMessage name="slot" />
                      </div>
                    </div> */}
                    <div className="flex-1 flex flex-col w-full">
                      <label>
                        Slot <span className="text-red-500">*</span>
                      </label>
                      <Field name="slot">
                        {({ field, form }) => (
                          <Select
                            value={field.value || undefined}
                            onValueChange={(val) =>
                              form.setFieldValue("slot", val)
                            }
                          >
                            <SelectTrigger className="w-full h-10 rounded px-3">
                              <SelectValue placeholder="Select Slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {generateSlots().map((slot, idx) => (
                                <SelectItem key={idx} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </Field>
                      <div className="h-5 text-red-500 text-sm">
                        <ErrorMessage name="slot" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end w-full md:w-auto">
                    <Button
                      type="submit"
                      className="w-full md:w-auto px-4 mt-2 bg-[#2798b5] rounded hover:bg-[#35a7c7] text-white hover:scale-105 transition"
                    >
                      Add Slot
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle>Existing Slots</CardTitle>
          <Input
            placeholder="Search slots..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <Table className="min-w-[600px]">
              <TableHeader className="bg-[#1f7a91] text-white">
                <TableRow>
                  <TableHead
                    className="text-center cursor-pointer text-white font-semibold"
                    onClick={() => handleSort("slot")}
                  >
                    Slot{" "}
                    {sortField === "slot"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer text-white font-semibold"
                    onClick={() => handleSort("isBooked")}
                  >
                    Booked?{" "}
                    {sortField === "isBooked"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </TableHead>
                  <TableHead className="text-center text-white font-semibold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedSlots.length > 0 ? (
                  paginatedSlots.map((s) => (
                    <TableRow
                      key={s.id}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <TableCell className="text-center">{s.slot}</TableCell>
                      <TableCell className="text-center">
                        {s.isBooked ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded px-3 py-1 hover:opacity-90"
                          onClick={() =>
                            handleDeleteSlot(s.id, s.service_id, s.date)
                          }
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-gray-500 py-4 font-medium"
                    >
                      No slots found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <Button
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <span>
                {page} / {totalPages}
              </span>
              <Button
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSlotManagement;
