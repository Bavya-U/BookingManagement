import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../redux/actions/authAction";
import logo from "../assets/logo.png";

// ShadCN UI components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading } = useSelector((state) => state.auth);

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(loginUser(values.email, values.password));
    setSubmitting(false);
  };

  useEffect(() => {
    if (user?.role === "Admin") navigate("/admin-dashboard/admin-service-management");
    if (user?.role === "Resident") navigate("/resident-dashboard/resident-booking");
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Main Card with Flex Row */}
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl overflow-hidden flex flex-row p-0">
        {/* Left Gradient Section (Hidden on mobile) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-r from-[#2798b5] to-[#6ed7ec] text-white flex-col justify-center px-15">
          <img src={logo} alt="Logo" className="w-45 cursor-pointer" />
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
        </div>

        {/* Right Login Section */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-5">
          <CardContent className="w-full p-0">
            <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`${
                        errors.email && touched.email ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password">
                      Password <span className="text-red-500">*</span>{" "}
                    </Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className={`pr-10 ${
                          errors.password && touched.password
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#2798b5] hover:bg-[#1f7a91] text-white"
                    disabled={loading || isSubmitting}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Form>
              )}
            </Formik>

            {/* Sign Up Link */}
            <p className="text-center mt-4 text-gray-600">
              Don&apos;t have an account?{" "}
              <span
                className="text-[#2798b5] font-semibold cursor-pointer"
                onClick={() => navigate("/")}
              >
                Sign Up
              </span>
            </p>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default Login;
