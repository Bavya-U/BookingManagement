import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/actions/authAction";
import logo from "../assets/logo.png";
import { Menu } from "lucide-react";
import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setUserMenuOpen(false);
    toast.success("Logout successful!");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-white/40 px-2 py-1 rounded-md font-semibold"
      : "hover:bg-white/20 px-2 py-1 rounded-md";

  const renderMenuItems = () => {
    if (user?.role === "Resident") {
      return (
        <>
          <span
            className={`text-sm cursor-pointer ${isActive(
              "/resident-dashboard/resident-booking"
            )}`}
            onClick={() => navigate("/resident-dashboard/resident-booking")}
          >
            Booking a Service
          </span>
          <span
            className={`text-sm cursor-pointer ${isActive(
              "/resident-dashboard/resident-my-bookings"
            )}`}
            onClick={() => navigate("/resident-dashboard/resident-my-bookings")}
          >
            My Booking
          </span>
        </>
      );
    } else if (user?.role === "Admin") {
      return (
        <>
          <span
            className={`text-sm cursor-pointer ${isActive(
              "/admin-dashboard/admin-service-management"
            )}`}
            onClick={() =>
              navigate("/admin-dashboard/admin-service-management")
            }
          >
            Manage Service
          </span>
          <span
            className={`text-sm cursor-pointer ${isActive(
              "/admin-dashboard/admin-slot-management"
            )}`}
            onClick={() => navigate("/admin-dashboard/admin-slot-management")}
          >
            Manage Slot
          </span>
          <span
            className={`text-sm cursor-pointer ${isActive(
              "/admin-dashboard/admin-bookings"
            )}`}
            onClick={() => navigate("/admin-dashboard/admin-bookings")}
          >
            View All Bookings
          </span>
        </>
      );
    }
    return null;
  };

  return (
    <nav className="bg-[#2798b5] text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-2">
        <img
          src={logo}
          alt="Logo"
          className="w-36 h-15 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="hidden md:flex items-center gap-6">
          {renderMenuItems()}

          <div className="relative">
            <FiUser
              className="h-6 w-6 cursor-pointer"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            />
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg p-3 space-y-2 z-50">
                <div className="text-sm flex font-semibold">
                  Email:
                  <span className="text-sm font-light ml-2">{user?.email}</span>
                </div>

                <div className="text-sm flex font-semibold">
                  Role:
                  <span className="text-sm font-light ml-2">{user?.role}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#2798b5] text-white p-4 space-y-3">
          {renderMenuItems()}

          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <FiUser className="h-5 w-5" />
            </div>
            {userMenuOpen && (
              <div className="mt-2 bg-white text-black rounded shadow-lg p-3 space-y-2">
                <div className="text-sm flex font-semibold">
                  Email:
                  <span className="text-sm font-light ml-2">{user?.email}</span>
                </div>

                <div className="text-sm flex font-semibold">
                  Role:
                  <span className="text-sm font-light ml-2">{user?.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
