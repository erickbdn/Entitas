"use client";

import { getAuth } from "firebase/auth";
import { createContext, useContext, ReactNode } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Define sales data structure
interface SalesData {
  todaySales: number;
  weeklySalesTrend: { day: string; value: number }[];
  monthlySales: number;
  previousMonthSales: number;
  growth: number | null;
  hotItem: {
    productId: string;
    name: string;
    imageUrl: string;
    stockRemaining: number | "N/A";
    unitsSold: number;
    revenue: number;
  } | null;
}

interface SalesDataContextType {
  salesData: SalesData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Create context
const SalesDataContext = createContext<SalesDataContextType | undefined>(
  undefined
);

// Fetch Sales Data
async function fetchSalesData() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  // 🔹 Get Firebase Token
  const token = await user.getIdToken();
  const apiUrl = "http://localhost:3001/api/sales";

  const response = await axios.get(apiUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data;
  console.log(data)

  if (data.error) throw new Error(data.error);

  const { monthlySales, previousMonthSales } = data;
  const growth =
    previousMonthSales > 0
      ? ((monthlySales - previousMonthSales) / previousMonthSales) * 100
      : null;

  return { salesData: { ...data, growth } };
}

// Provider component
export function SalesDataProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["salesData"],
    queryFn: fetchSalesData,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false, // No auto-refetch when switching tabs
  });

  return (
    <SalesDataContext.Provider
      value={{
        salesData: data?.salesData || null,
        loading: isLoading,
        error: error ? error.message : null,
        refetch,
      }}
    >
      {children}
    </SalesDataContext.Provider>
  );
}

// Hook to use sales data
export function useSalesDataContext() {
  const context = useContext(SalesDataContext);
  if (!context) {
    throw new Error(
      "useSalesDataContext must be used within a SalesDataProvider"
    );
  }
  return context;
}
