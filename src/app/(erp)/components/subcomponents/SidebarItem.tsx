import Link from "next/link";
import { JSX } from "react";

interface SidebarItemProps {
  name: string;
  href: string;
  Icon: JSX.ElementType;
  isActive: boolean;
  isExpanded: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export function SidebarItem({ name, href, Icon, isActive, isExpanded, onClick }: SidebarItemProps) {
  return (
    <li className="w-full">
      <Link
        href={href}
        className={`flex items-center justify-start space-x-3 px-4 py-2 text-secondary-lighter rounded-2xl transition-all duration-300
          ${isActive ? "bg-[#BCA58A] bg-opacity-15 shadow-md" : "hover:bg-[#BCA58A] hover:bg-opacity-15 hover:shadow-md"}`}
        onClick={onClick}
      >
        <Icon className="w-5 h-5 text-secondary-lighter flex-shrink-0" />
        <span className={`transition-opacity duration-200 overflow-hidden whitespace-nowrap ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
          {name}
        </span>
      </Link>
    </li>
  );
}


