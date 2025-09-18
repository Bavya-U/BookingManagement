import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";

// ShadCN UI imports
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import backgroundImg from "../../assets/booking-bg.jpg";

// Redux actions
import { fetchServices, fetchSlots, addBooking } from "@/redux/actions/bookingAction";

const ResidentBooking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { services, slots } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      serviceId: "",
      date: new Date(),
      slot: "",
      name: "",
      email: "",
      phone: "",
    },
    validationSchema: Yup.object({
      serviceId: Yup.string().required("Service is required"),
      date: Yup.date().required("Date is required").nullable(),
      slot: Yup.string().required("Time slot is required"),
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),
    }),
    onSubmit: (values) => {
      const bookingData = {
        ...values,
        date: values.date.toISOString().split("T")[0], // format date
      };
      dispatch(addBooking(bookingData, navigate));
    },
  });

  // ✅ Fetch slots whenever service/date changes
  useEffect(() => {
    if (formik.values.serviceId && formik.values.date) {
      const formattedDate = formik.values.date.toISOString().split("T")[0];
      dispatch(fetchSlots(formik.values.serviceId, formattedDate));
    }
  }, [dispatch, formik.values.serviceId, formik.values.date]);

  return (
    <div
      className="h-[630px] w-full relative bg-cover bg-center flex"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Wrapper */}
      <div className="relative flex w-full max-w-6xl mx-auto my-10 px-4">
        {/* Left side text */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center text-white px-10">
          <div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Services!</h1>
            <p className="text-lg">
              Book your preferred service easily. Choose a date, time, and let us take care of the rest.
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="w-full md:w-1/2 mx-auto my-20 px-4">
          <Card className="bg-gray-400/80 border-0 shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">
                Book a Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Service */}
                  <div>
                    <Label>Service</Label>
                    <Select
                      value={formik.values.serviceId}
                      onValueChange={(val) => formik.setFieldValue("serviceId", val)}
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
                      <p className="text-red-500 text-sm p-0 m-0">{formik.errors.serviceId}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
  <Label>Date</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className="w-full justify-start text-left font-normal rounded bg-white"
      >
        {formik.values.date ? format(formik.values.date, "PPP") : "Pick a date"}
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


                  {/* Time Slot */}
                  <div>
                    <Label>Time Slot</Label>
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
                      <p className="text-red-500 text-sm p-0 m-0">{formik.errors.slot}</p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <Label>Your Name</Label>
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
                      <p className="text-red-500 text-sm p-0 m-0">{formik.errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label>Email</Label>
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
                      <p className="text-red-500 text-sm p-0 m-0">{formik.errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label>Phone</Label>
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
                      <p className="text-red-500 text-sm p-0 m-0">{formik.errors.phone}</p>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full mt-2 bg-[#2798b5]">
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



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { format } from "date-fns";

// // ShadCN UI imports
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import backgroundImg from "../../assets/booking-bg.jpg";

// // Redux actions
// import { fetchServices, fetchSlots, addBooking } from "@/redux/actions/bookingAction";

// const ResidentBooking = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { services, slots } = useSelector((state) => state.booking);

//   const [selectedService, setSelectedService] = useState("");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");

//   useEffect(() => {
//     dispatch(fetchServices());
//   }, [dispatch]);

//   useEffect(() => {
//     if (selectedService && selectedDate) {
//       const formattedDate = selectedDate.toISOString().split("T")[0];
//       dispatch(fetchSlots(selectedService, formattedDate));
//     }
//   }, [dispatch, selectedService, selectedDate]);

//   const handleBooking = (e) => {
//     e.preventDefault();
//     if (!selectedService || !selectedDate || !selectedSlot) {
//       alert("Please select service, date, and time slot!");
//       return;
//     }

//     const bookingData = {
//       serviceId: selectedService,
//       date: selectedDate.toISOString().split("T")[0],
//       slot: selectedSlot,
//       name,
//       email,
//       phone,
//     };

//     dispatch(addBooking(bookingData, navigate));
//   };

//   return (
//     <div
//       className="h-[630px] w-full relative bg-cover bg-center flex"
//       style={{ backgroundImage: `url(${backgroundImg})` }}
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/40"></div>

//       {/* Content Wrapper */}
//       <div className="relative flex w-full max-w-6xl mx-auto my-10 px-4">
//         <div className="hidden md:flex md:w-1/2 items-center justify-center text-white px-10">
//           <div>
//             <h1 className="text-4xl font-bold mb-4">Welcome to Our Services!</h1>
//             <p className="text-lg">
//               Book your preferred service easily. Choose a date, time, and let us take care of the rest.
//             </p>
//           </div>
//         </div>
//         <div className="w-full md:w-1/2 mx-auto my-20 px-4 ">
//           <Card className="bg-gray-400/80 border-0 shadow-lg rounded-lg">
//             <CardHeader>
//               <CardTitle className="text-xl font-bold text-center">
//                 Book a Service
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleBooking} className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {/* Service */}
//                   <div>
//                     <Label>Service</Label>
//                     <Select value={selectedService} onValueChange={setSelectedService}>
//                       <SelectTrigger className="w-full bg-white rounded">
//                         <SelectValue placeholder="Select Service" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {services.map((s) => (
//                           <SelectItem key={s.id} value={s.id}>
//                             {s.name || "No Name"}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Date */}
//                   <div>
//                     <Label>Date</Label>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           className="w-full justify-start text-left font-normal rounded"
//                         >
//                           {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0">
//                         <Calendar
//                           mode="single"
//                           selected={selectedDate}
//                           onSelect={setSelectedDate}
//                           initialFocus
//                         />
//                       </PopoverContent>
//                     </Popover>
//                   </div>

//                   {/* Time Slot */}
//                   <div>
//                     <Label>Time Slot</Label>
//                     <Select onValueChange={setSelectedSlot}>
//                       <SelectTrigger className="w-full bg-white rounded">
//                         <SelectValue placeholder="Select Time Slot" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {slots.length > 0 ? (
//                           slots.map((slot) => (
//                             <SelectItem key={slot.id} value={slot.slot}>
//                               {slot.slot}
//                             </SelectItem>
//                           ))
//                         ) : (
//                           <SelectItem value="no-slots" disabled>
//                             No slots available
//                           </SelectItem>
//                         )}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Name */}
//                   <div>
//                     <Label>Your Name</Label>
//                     <Input
//                       type="text"
//                       value={name}
//                       className="bg-white rounded"
//                       onChange={(e) => setName(e.target.value)}
//                       placeholder="Enter Your Name"
//                       required
//                     />
//                   </div>

//                   {/* Email */}
//                   <div>
//                     <Label>Email</Label>
//                     <Input
//                       type="email"
//                       value={email}
//                       className="bg-white rounded"
//                       placeholder="Enter Your Email"
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                     />
//                   </div>

//                   {/* Phone */}
//                   <div>
//                     <Label>Phone</Label>
//                     <Input
//                       type="text"
//                       value={phone}
//                       className="bg-white rounded"
//                       placeholder="Enter Your Phone"
//                       onChange={(e) => setPhone(e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <Button type="submit" className="w-full mt-2 bg-[#2798b5]">
//                   Book Now
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResidentBooking;
