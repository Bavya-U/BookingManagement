import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Admin Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button
              className="w-full"
              onClick={() => navigate("/admin-dashboard/admin-slot-management")}
            >
              Manage Slots
            </Button>

            <Button
              className="w-full"
              onClick={() => navigate("/admin-dashboard/admin-service-management")}
              variant="secondary"
            >
              Manage Services
            </Button>

            <Button
              className="w-full"
              onClick={() => navigate("/admin-dashboard/admin-bookings")}
              variant="outline"
            >
              View All Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
