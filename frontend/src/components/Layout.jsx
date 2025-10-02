import React, { useState, useEffect } from "react"; 
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { jwtDecode } from 'jwt-decode';

export default function Layout({ children }) {
  const [activeTab, setActiveTab] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token", err);
        setRole(null);
      }
    }
  }, []);

  const handleChangeTab = (tabName) => {
    setActiveTab(tabName);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        onChangeTab={handleChangeTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        role={role}
      />

      <div className="flex flex-col flex-grow transition-all duration-300 md:ml-64">
        <Navbar setIsOpen={setSidebarOpen} />
        <main className="flex-grow p-6 overflow-auto">
          {activeTab && <h1 className="hidden md:block text-3xl font-bold mb-6">{activeTab}</h1>}
          {children}
        </main>
      </div>
    </div>
  );
}
