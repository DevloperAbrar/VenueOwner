import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ sidebarItems, pageTitle, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col">
        <Navbar title={pageTitle} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}