import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function ResidentDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-primary">
            Resident Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="w-full sm:w-auto bg-primary text-white"
            onClick={() => navigate("/resident-dashboard/resident-booking")}
          >
            Book a Service
          </Button>

          <Button
            className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700"
            onClick={() => navigate("/resident-dashboard/resident-my-bookings")}
          >
            My Bookings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResidentDashboard;
