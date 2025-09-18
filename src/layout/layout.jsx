import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./navbar";

function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 bg-gray-100 p-0 overflow-y-auto">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
