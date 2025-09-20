import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServices,
  addService,
  deleteService,
} from "../../redux/actions/serviceAction";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

// Yup validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string(),
});

const AdminServiceManagement = () => {
  const dispatch = useDispatch();
  const { list: services, loading } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = (data) => {
    dispatch(addService(data.name, data.description));
    reset(); // Reset the form after submit
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Service Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Service Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter service name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 mb-0 p-0">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Textarea
                placeholder="Enter description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto bg-[#2798b5] rounded hover:bg-[#35a7c7] text-white mb-4 hover:scale-105 transition"
            >
              Add Service
            </Button>
          </form>

          <h3 className="text-lg font-medium pt-4">Existing Services</h3>
          <div className="overflow-x-auto">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
                <Table className="w-full">
                  <TableHeader className="bg-[#1f7a91] text-white">
                    <TableRow>
                      <TableHead className="text-white font-semibold">
                        Service Name
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Description
                      </TableHead>
                      <TableHead className="text-white font-semibold text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {services.length > 0 ? (
                      services.map((s) => (
                        <TableRow
                          key={s.id}
                          className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell className="text-gray-600">
                            {s.description || "No description"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="rounded-md px-3 py-1 hover:opacity-90"
                              onClick={() => dispatch(deleteService(s.id))}
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
                          className="text-center text-gray-500 py-4"
                        >
                          No services found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServiceManagement;
