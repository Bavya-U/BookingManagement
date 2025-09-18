import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/actions/authAction";
import logo from "../assets/logo.png";
import { Menu } from "lucide-react"; 
import { FiUser } from "react-icons/fi";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setUserMenuOpen(false);
  };

  // Role-based menu items
  const renderMenuItems = () => {
    if (user?.role === "Resident") {
      return (
        <>
          <span
            className="text-sm cursor-pointer"
            onClick={() => navigate("/resident-dashboard/resident-booking")}
          >
            Booking a Service
          </span>
          <span
            className="text-sm cursor-pointer"
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
            className="text-sm cursor-pointer"
            onClick={() => navigate("/admin-dashboard/admin-slot-management")}
          >
            Manage Slot
          </span>
          <span
            className="text-sm cursor-pointer"
            onClick={() => navigate("/admin-dashboard/admin-service-management")}
          >
            Manage Service
          </span>
          <span
            className="text-sm cursor-pointer"
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
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="w-36 h-15 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {renderMenuItems()}

          {/* User Icon Dropdown */}
          <div className="relative">
            <FiUser
              className="h-6 w-6 cursor-pointer"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            />
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg p-3 space-y-2 z-50">
                <div className="text-sm">{user?.email}</div>
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#2798b5] text-white p-4 space-y-3">
          {renderMenuItems()}

          {/* Mobile User Dropdown */}
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <FiUser className="h-5 w-5" />
              <span>User</span>
            </div>
            {userMenuOpen && (
              <div className="mt-2 bg-white text-black rounded shadow-lg p-3 space-y-2">
                <div className="text-sm">{user?.email}</div>
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


// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../redux/actions/authAction";
// import logo from "../assets/logo.png";
// import { Menu, User } from "lucide-react"; // User icon
// import { FiUser } from "react-icons/fi"; // optional alternative

// function Navbar() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   console.log(user)
//   const [isOpen, setIsOpen] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//     setUserMenuOpen(false);
//   };

//   return (
//     <nav className="bg-[#2798b5] text-white shadow-md">
//       <div className="container mx-auto flex items-center justify-between px-2">
//         {/* Logo */}
//         <img
//           src={logo}
//           alt="Logo"
//           className="w-36 h-15 cursor-pointer"
//           onClick={() => navigate("/")}
//         />

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center gap-6">
//           <span className="text-sm cursor-pointer" onClick={() => navigate("/resident-dashboard/resident-booking")}>
//             Booking a Service
//           </span>
//           <span className="text-sm cursor-pointer" onClick={() => navigate("/resident-dashboard/resident-my-bookings")}>
//             My Booking
//           </span>

//           {/* User Icon Dropdown */}
//           <div className="relative">
//             <FiUser
//               className="h-6 w-6 cursor-pointer"
//               onClick={() => setUserMenuOpen(!userMenuOpen)}
//             />
//             {userMenuOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg p-3 space-y-2 z-50">
//                 <div className="text-sm">{user?.email}</div>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left text-sm text-red-600 hover:text-red-800"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden"
//           onClick={() => setIsOpen(!isOpen)}
//           aria-label="Toggle Menu"
//         >
//           <Menu className="h-6 w-6" />
//         </button>
//       </div>

//       {/* Mobile Dropdown */}
//       {isOpen && (
//         <div className="md:hidden bg-[#2798b5] text-white p-4 space-y-3">
//           <span className="block cursor-pointer" onClick={() => { navigate("/booking"); setIsOpen(false); }}>
//             Booking
//           </span>
//           <span className="block cursor-pointer" onClick={() => { navigate("/mybooking"); setIsOpen(false); }}>
//             My Booking
//           </span>

//           {/* Mobile User Dropdown */}
//           <div className="relative">
//             <div
//               className="flex items-center gap-2 cursor-pointer"
//               onClick={() => setUserMenuOpen(!userMenuOpen)}
//             >
//               <FiUser className="h-5 w-5" />
//               <span>User</span>
//             </div>
//             {userMenuOpen && (
//               <div className="mt-2 bg-white text-black rounded shadow-lg p-3 space-y-2">
//                 <div className="text-sm">{user?.email}</div>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left text-sm text-red-600 hover:text-red-800"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;

