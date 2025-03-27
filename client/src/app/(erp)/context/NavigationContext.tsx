"use client";
import { createContext, useContext, useState } from "react";
import { LayoutDashboard } from "lucide-react";

interface NavigationContextType {
  currentPage: string;
  currentIcon: React.ReactNode;
  setCurrentPage: (page: string, icon: React.ReactNode) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPageState] = useState("DASHBOARD");
  const [currentIcon, setCurrentIcon] = useState<React.ReactNode>(<LayoutDashboard className="w-5 h-5 text-secondary-lighter" />);

  const setCurrentPage = (page: string, icon: React.ReactNode) => {
    setCurrentPageState(page.toUpperCase());
    setCurrentIcon(icon);
  };

  return (
    <NavigationContext.Provider value={{ currentPage, currentIcon, setCurrentPage }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
