"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Bell, Search, User, Menu, X } from "lucide-react";

export default function UserActions() {
  const userEmail = useSelector((state: RootState) => state.auth.user?.email);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center space-x-10">
      {/* User Email (Only visible on lg screens) */}
      <div className="hidden lg:flex text-secondary-lighter text-sm truncate">
        {userEmail || "Loading..."}
      </div>

      {/* Search Icon (Hidden on small screens) */}
      <button className="hidden lg:flex justify-center items-center">
        <Search className="w-5 h-5 text-secondary-lighter cursor-pointer hover:text-white" />
      </button>

      {/* Notification Icon (Hidden on small screens) */}
      <button className="hidden lg:flex justify-center items-center">
        <Bell className="w-5 h-5 text-secondary-lighter cursor-pointer hover:text-white" />
      </button>

      {/* User Icon (Hidden on small screens) */}
      <button className="hidden lg:flex justify-center items-center">
        <User className="w-6 h-6 text-secondary-lighter cursor-pointer hover:text-white" />
      </button>

      {/* Mobile View: Hamburger Menu (Only visible on sm and md screens) */}
      <button className="lg:hidden flex justify-center items-center" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? (
          <X className="w-6 h-6 text-secondary-lighter cursor-pointer hover:text-white" />
        ) : (
          <Menu className="w-6 h-6 text-secondary-lighter cursor-pointer hover:text-white" />
        )}
      </button>

      {/* Dropdown Menu (Only on small screens) */}
      {menuOpen && (
        <div className="absolute top-16 right-4 w-40 bg-white shadow-lg rounded-lg p-2 z-50">
          <div className="flex flex-col space-y-3">
            <button className="flex items-center space-x-2 hover:text-gray-800">
              <Search className="w-5 h-5 text-gray-600" />
              <span className="text-sm">Search</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-gray-800">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="text-sm">Notifications</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-gray-800">
              <User className="w-6 h-6 text-gray-600" />
              <span className="text-sm">Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
