import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import backgroundImg from "../../assets/booking2.jpg";

import {
  fetchServices,
  fetchSlots,
  addBooking,
} from "@/redux/actions/bookingAction";

const ResidentBooking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { services, slots } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      serviceId: "",
      date: new Date(),
      slot: "",
      name: "",
      email: user?.email,
      phone: "",
    },
    validationSchema: Yup.object({
      serviceId: Yup.string().required("Required"),
      date: Yup.date().required("Required").nullable(),
      slot: Yup.string().required("Required"),
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Required"),
    }),
    onSubmit: (values) => {
      const bookingData = {
        ...values,
        date: values.date.toISOString().split("T")[0],
      };
      dispatch(addBooking(bookingData, navigate));
    },
  });

  useEffect(() => {
    if (formik.values.serviceId && formik.values.date) {
      const formattedDate = formik.values.date.toISOString().split("T")[0];
      dispatch(fetchSlots(formik.values.serviceId, formattedDate));
    }
  }, [dispatch, formik.values.serviceId, formik.values.date]);

  return (
    <div
      className="min-h-screen w-full relative bg-cover bg-center flex"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative flex flex-col lg:flex-row w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center text-white px-6 lg:px-10">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Welcome to Our Services!
            </h1>
            <p className="text-base sm:text-lg">
              Book your preferred service easily. Choose a date, time, and let
              us take care of the rest.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <Card className="w-full max-w-xl bg-gray-300/80 border-0 shadow-lg rounded-lg p-2 sm:p-4">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold text-center mt-3">
                Book a Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Service <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formik.values.serviceId}
                      onValueChange={(val) =>
                        formik.setFieldValue("serviceId", val)
                      }
                    >
                      <SelectTrigger className="w-full bg-white rounded">
                        <SelectValue placeholder="Select Service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name || "No Name"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.serviceId && formik.errors.serviceId && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.serviceId}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal rounded bg-white"
                        >
                          {formik.values.date
                            ? format(formik.values.date, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formik.values.date}
                          onSelect={(val) => formik.setFieldValue("date", val)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>
                      Time Slot <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formik.values.slot}
                      onValueChange={(val) => formik.setFieldValue("slot", val)}
                    >
                      <SelectTrigger className="w-full bg-white rounded">
                        <SelectValue placeholder="Select Time Slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {slots.length > 0 ? (
                          slots.map((slot) => (
                            <SelectItem key={slot.id} value={slot.slot}>
                              {slot.slot}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-slots" disabled>
                            No slots available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {formik.touched.slot && formik.errors.slot && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.slot}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>
                      Your Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white rounded"
                      placeholder="Enter Your Name"
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white rounded"
                      placeholder="Enter Your Email"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white rounded"
                      placeholder="Enter Your Phone"
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2 bg-[#2798b5] rounded hover:bg-[#35a7c7] text-white mb-4 hover:scale-105 transition"
                >
                  Book Now
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResidentBooking;
