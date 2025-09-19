import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices, addService, deleteService } from "../../redux/actions/serviceAction";

// Formik + Yup
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// ShadCN UI
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

const AdminServiceManagement = () => {
  const dispatch = useDispatch();
  const { list: services, loading } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    description: Yup.string(),
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Service Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Formik
            initialValues={{ name: "", description: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              dispatch(addService(values.name, values.description));
              resetForm();
            }}
          >
            <Form className="grid gap-4">
              <div>
                <label className="block mb-1 font-medium">Service Name <span className="text-red-500">*</span></label>
                <Field as={Input} name="name" placeholder="Enter service name" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <Field as={Textarea} name="description" placeholder="Enter description" />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <Button type="submit" className="w-full md:w-auto bg-[#2798b5] rounded hover:bg-[#35a7c7] text-white mb-4 hover:scale-105 transition">Add Service</Button>
            </Form>
          </Formik>

          <h3 className="text-lg font-medium pt-4">Existing Services</h3>
          <div className="overflow-x-auto">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
  <Table className="w-full">
    <TableHeader className="bg-[#1f7a91] text-white">
      <TableRow>
        <TableHead className="text-white font-semibold">Service Name</TableHead>
        <TableHead className="text-white font-semibold">Description</TableHead>
        <TableHead className="text-white font-semibold text-center">Action</TableHead>
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
