import { useState, JSX, useEffect } from "react";
import React from "react";
import { useNavigation } from "@/app/(erp)/context/NavigationContext";
import { navItems } from "./subcomponents/NavItems";
import { SidebarItem } from "./subcomponents/SidebarItem";
import { Menu, X } from "lucide-react"; // Import icons for mobile menu

export default function Sidebar() {
  const { setCurrentPage } = useNavigation();
  const [activePage, setActivePage] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile dropdown state

  const handlePageChange = (page: string, icon: JSX.Element) => {
    setCurrentPage(page, icon);
    setActivePage(page);
  };

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileOpen]);

  return (
    <>
      {/* 🔹 Sidebar for Medium to Large Screens (Expands and Collapses) */}
      <nav
  className={`hidden md:flex flex-col self-start pb-4 pt-4 rounded-2xl transition-all duration-300 ease-in-out
    ${isExpanded ? "w-1/6" : "w-14"} hover:bg-[var(--primary-5)] hover:shadow-md hover:cursor-pointer`}
  onClick={() => setIsExpanded((prev) => !prev)}
>
  <ul className="space-y-4">  {/* No need for w-full on ul */}
    {navItems.map(({ name, href, icon }) => (
      <SidebarItem
        key={name}
        name={name}
        href={href}
        Icon={icon}
        isActive={activePage === name}
        isExpanded={isExpanded}
        onClick={(e) => {
          e.stopPropagation();  // Prevent sidebar from toggling when clicking a link
          handlePageChange(name, React.createElement(icon, { className: "w-5 h-5 text-secondary-lighter" }));
        }}
      />
    ))}
  </ul>
</nav>


      {/* 🔹 Mobile Sidebar Button (Stays Fixed in Place) */}
      <button
        className="md:hidden fixed left-4 z-50 bg-[var(--primary-5)] p-2 rounded-full shadow-md"
        onClick={() => setIsMobileOpen((prev) => !prev)}
      >
        {isMobileOpen ? <X className="w-6 h-6 text-secondary-lighter" /> : <Menu className="w-6 h-6 text-secondary-lighter" />}
      </button>

      {/* 🔹 Mobile Sidebar (Dropdown - Slides in from Left) */}
      <div className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity ${isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMobileOpen(false)} // Close when clicking outside
      >
        <nav
          className={`fixed top-32 left-0 h-full w-64 bg-[var(--bg-primary-5)] shadow-lg pt-4 px-6 transform transition-transform duration-300 
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`} // Slide effect
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <ul className="space-y-4">
            {navItems.map(({ name, href, icon }) => (
              <SidebarItem
                key={name}
                name={name}
                href={href}
                Icon={icon}
                isActive={activePage === name}
                isExpanded={true} // Always expanded in mobile dropdown
                onClick={() => setIsMobileOpen(false)} // Close menu on click
              />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
