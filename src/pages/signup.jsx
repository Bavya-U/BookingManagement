import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetSignup, signupUser } from "../redux/actions/authAction";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.png";

// ShadCN UI components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/login");
      dispatch(resetSignup());
    }
  }, [user, navigate, dispatch]);

  const initialValues = {
    email: "",
    password: "",
    role: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Required"),
    role: Yup.string().required("Please select a role"),
  });

  const handleSubmit = (values, { resetForm }) => {
    const { email, password, role } = values;
    dispatch(signupUser(email, password, role));
    resetForm();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Main Card with Flex Row */}
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl overflow-hidden flex flex-row p-0">
        {/* Left Gradient Section (Hidden on mobile) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-r from-[#2798b5] to-[#6ed7ec] text-white flex-col justify-center px-15">
          <img src={logo} alt="Logo" className="w-45 cursor-pointer" />
          <h2 className="text-4xl font-bold mb-4">Join Us Today!</h2>
        </div>

        {/* Right Login Section */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-5">
          <CardContent className="w-full p-0">
            <h2 className="text-3xl font-bold text-center mb-6">
              Create Your Account
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form className="space-y-5">
                  {/* Role Selection */}
                  {/* <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant={values.role === "Admin" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setFieldValue("role", "Admin")}
                  >
                    Admin
                  </Button>
                  <Button
                    type="button"
                    variant={values.role === "Resident" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setFieldValue("role", "Resident")}
                  >
                    Resident
                  </Button>
                </div> */}
                  <div className="mb-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        type="button"
                        className={`flex-1 rounded ${
                          values.role === "Admin"
                            ? "bg-[#2798b5] text-white hover:bg-[#2798b5] focus:bg-[#2798b5] active:bg-[#2798b5]"
                            : "bg-white border border-gray-300 text-black hover:bg-gray-100 focus:bg-white active:bg-white"
                        }`}
                        onClick={() => setFieldValue("role", "Admin")}
                      >
                        Admin
                      </Button>

                      <Button
                        type="button"
                        className={`flex-1 rounded ${
                          values.role === "Resident"
                            ? "bg-[#2798b5] text-white hover:bg-[#2798b5] focus:bg-[#2798b5] active:bg-[#2798b5]"
                            : "bg-white border border-gray-300 text-black hover:bg-gray-100 focus:bg-white active:bg-white"
                        }`}
                        onClick={() => setFieldValue("role", "Resident")}
                      >
                        Resident
                      </Button>
                    </div>
                    {errors.role && touched.role && (
                      <div className="text-red-500 text-sm text-center p-0 m-0">
                        {errors.role}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      id="email"
                      placeholder="you@example.com"
                      className={`w-full ${
                        errors.email && touched.email ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Create your password"
                        className={`w-full ${
                          errors.password && touched.password
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <span
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ?<FaEyeSlash />  : <FaEye />}
                      </span>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-[#2798b5] rounded hover:bg-[#35a7c7] text-white hover:scale-105 transition"
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Signup"}
                  </Button>
                </Form>
              )}
            </Formik>

            {/* Sign Up Link */}
            <p className="text-center mt-4 text-gray-600">
              Already have an account?{" "}
              <span
                className="text-[#2798b5] font-semibold cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </CardContent>
        </div>
      </Card>
    </div>

    // <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
    //   <Card className="w-full sm:max-w-md lg:max-w-lg shadow-lg rounded-xl">
    //     <CardHeader>
    //       <CardTitle className="text-center text-xl sm:text-2xl font-bold">
    //         Create Your Account
    //       </CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <Formik
    //         initialValues={initialValues}
    //         validationSchema={validationSchema}
    //         onSubmit={handleSubmit}
    //       >
    //         {({ values, errors, touched, setFieldValue }) => (
    //           <Form className="space-y-5">
    //             {/* Role Selection */}
    //             <div className="flex flex-col sm:flex-row gap-2">
    //               <Button
    //                 type="button"
    //                 variant={values.role === "Admin" ? "default" : "outline"}
    //                 className="flex-1"
    //                 onClick={() => setFieldValue("role", "Admin")}
    //               >
    //                 Admin
    //               </Button>
    //               <Button
    //                 type="button"
    //                 variant={values.role === "Resident" ? "default" : "outline"}
    //                 className="flex-1"
    //                 onClick={() => setFieldValue("role", "Resident")}
    //               >
    //                 Resident
    //               </Button>
    //             </div>
    //             {errors.role && touched.role && (
    //               <div className="text-red-500 text-sm text-center">{errors.role}</div>
    //             )}

    //             {/* Email */}
    //             <div>
    //               <Label htmlFor="email">Email</Label>
    //               <Field
    //                 as={Input}
    //                 type="email"
    //                 name="email"
    //                 id="email"
    //                 placeholder="Enter your email"
    //                 className={`w-full ${
    //                   errors.email && touched.email ? "border-red-500" : ""
    //                 }`}
    //               />
    //               <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
    //             </div>

    //             {/* Password */}
    //             <div>
    //               <Label htmlFor="password">Password</Label>
    //               <div className="relative">
    //                 <Field
    //                   as={Input}
    //                   type={showPassword ? "text" : "password"}
    //                   name="password"
    //                   id="password"
    //                   placeholder="Enter your password"
    //                   className={`w-full ${
    //                     errors.password && touched.password ? "border-red-500" : ""
    //                   }`}
    //                 />
    //                 <span
    //                   className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
    //                   onClick={() => setShowPassword(!showPassword)}
    //                 >
    //                   {showPassword ? <FaEye /> : <FaEyeSlash />}
    //                 </span>
    //               </div>
    //               <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
    //             </div>

    //             {/* Submit */}
    //             <Button type="submit" className="w-full py-2 sm:py-3 text-base" disabled={loading}>
    //               {loading ? "Signing up..." : "Signup"}
    //             </Button>
    //           </Form>
    //         )}
    //       </Formik>
    //     </CardContent>
    //     <CardFooter>
    //       <p className="text-center text-sm sm:text-base text-gray-600 w-full">
    //         Already have an account?{" "}
    //         <span
    //           className="text-blue-600 font-medium cursor-pointer"
    //           onClick={() => navigate("/login")}
    //         >
    //           Login
    //         </span>
    //       </p>
    //     </CardFooter>
    //   </Card>
    // </div>
  );
};

export default Signup;
