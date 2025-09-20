import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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

const formatDateToLocal = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ResidentBooking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { services, slots } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const schema = Yup.object().shape({
    serviceId: Yup.string().required("Required"),
    date: Yup.date().required("Required").nullable(),
    slot: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Required"),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceId: "",
      date: new Date(),
      slot: "",
      name: "",
      email: user?.email || "",
      phone: "",
    },
    resolver: yupResolver(schema),
  });

  const watchService = watch("serviceId");
  const watchDate = watch("date");

  useEffect(() => {
    if (watchService && watchDate) {
      dispatch(fetchSlots(watchService, formatDateToLocal(watchDate)));
    }
  }, [dispatch, watchService, watchDate]);

  const onSubmit = (data) => {
    const bookingData = {
      ...data,
      date: formatDateToLocal(data.date),
    };
    dispatch(addBooking(bookingData, navigate));
  };

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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Service <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="serviceId"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} onValueChange={field.onChange}>
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
                      )}
                    />
                    {errors.serviceId && (
                      <p className="text-red-500 text-sm p-0 m-0">
                        {errors.serviceId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal rounded bg-white"
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(val) => field.onChange(val)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm p-0 m-0">
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>
                      Time Slot <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="slot"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} onValueChange={field.onChange}>
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
                      )}
                    />
                    {errors.slot && (
                      <p className="text-red-500 text-sm p-0 m-0">
                        {errors.slot.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>
                      Your Name <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter Your Name"
                          className="bg-white rounded"
                        />
                      )}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm p-0 m-0">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter Your Email"
                          className="bg-white rounded"
                        />
                      )}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm p-0 m-0">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter Your Phone"
                          className="bg-white rounded"
                        />
                      )}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm  p-0 m-0">
                        {errors.phone.message}
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
