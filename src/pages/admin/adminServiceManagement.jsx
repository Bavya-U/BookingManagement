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
    name: Yup.string().required("Service name is required"),
    description: Yup.string(),
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Admin Service Management</CardTitle>
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
                <label className="block mb-1 font-medium">Service Name</label>
                <Field as={Input} name="name" placeholder="Enter service name" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <Field as={Textarea} name="description" placeholder="Enter description" />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <Button type="submit" className="w-full md:w-auto">Add Service</Button>
            </Form>
          </Formik>

          <h3 className="text-lg font-medium pt-4">Existing Services</h3>
          <div className="overflow-x-auto">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.length > 0 ? (
                    services.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.description || "No description"}</TableCell>
                        <TableCell>
                          <Button variant="destructive" size="sm" onClick={() => dispatch(deleteService(s.id))}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">
                        No services found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServiceManagement;
