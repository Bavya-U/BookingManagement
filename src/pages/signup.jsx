import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signupUser, resetSignup } from "../redux/actions/authAction";
import logo from "../assets/logo.png";

import { Card, CardContent } from "@/components/ui/card";
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

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    role: Yup.string().required("Please select a role"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const watchRole = watch("role");

  const onSubmit = (data) => {
    const { email, password, role } = data;
    dispatch(signupUser(email, password, role));
    reset();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl overflow-hidden flex flex-row p-0">
        <div className="hidden md:flex w-1/2 bg-gradient-to-r from-[#2798b5] to-[#6ed7ec] text-white flex-col justify-center px-15">
          <img src={logo} alt="Logo" className="w-45 cursor-pointer" />
          <h2 className="text-4xl font-bold mb-4">Join Us Today!</h2>
        </div>

        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-5">
          <CardContent className="w-full p-0">
            <h2 className="text-1xl font-bold text-center mb-6">Signup</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="mb-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    className={`flex-1 rounded ${
                      watchRole === "Admin"
                        ? "bg-[#2798b5] text-white"
                        : "bg-white border border-gray-300 text-black"
                    }`}
                    onClick={() => setValue("role", "Admin")}
                  >
                    Admin
                  </Button>

                  <Button
                    type="button"
                    className={`flex-1 rounded ${
                      watchRole === "Resident"
                        ? "bg-[#2798b5] text-white"
                        : "bg-white border border-gray-300 text-black"
                    }`}
                    onClick={() => setValue("role", "Resident")}
                  >
                    Resident
                  </Button>
                </div>
                {errors.role && (
                  <div className="text-red-500 text-sm text-center mt-1">
                    {errors.role.message}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`w-full ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Create your password"
                    {...register("password")}
                    className={`w-full ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2798b5] rounded hover:bg-[#35a7c7] text-white hover:scale-105 transition"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Signup"}
              </Button>
            </form>

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
  );
};

export default Signup;
