"use client";

import { useNavigation } from "@/app/(erp)/context/NavigationContext";
import UserActions from "./subcomponents/UserActions";

export default function Header() {
  const { currentPage, currentIcon } = useNavigation();

  return (
    <header className="flex items-center flex-col sm:flex-row justify-between py-4 gap-6">
      {/* Sidebar-Aligned Section (Same width as Sidebar) */}
      <div className="sm:w-1/6 flex items-center space-x-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <circle cx="12" cy="12" r="11" fill="#E9E1D8" />
          <path d="M12 6V18" stroke="#BCA58A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17.196 9L6.80402 15" stroke="#BCA58A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.80402 9L17.196 15" stroke="#BCA58A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 className="text-4xl font-bold tracking-tight text-secondary-lighter">ENTITAS</h1>
      </div>

      {/* Current Page Section (Aligned with Content, but no stretching) */}
      <div className="flex-1 flex justify-start pl-0 sm:pl-16 md:pl-10 lg:pl-0">
        {/* Icon (Fixed size, no stretch) */}
        <div className="w-16 h-12 flex items-center justify-center bg-primary-50 shadow-md rounded-2xl">
          {currentIcon}
        </div>
        {/* Title (Only takes necessary width) */}
        <div className="flex px-4 py-2 bg-primary-50 items-center justify-center shadow-md rounded-2xl">
          <span className="text-lg font-bold tracking-tight text-secondary-lighter">
            {currentPage}
          </span>
        </div>
      </div>

      {/* User Actions */}
      <div className="sm:w-1/6 flex justify-end">
        <UserActions />
      </div>
    </header>
  );
}
