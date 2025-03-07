"use client";

import { createContext, useContext, ReactNode } from "react";
import axios from "axios";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Query Client (single instance)
const queryClient = new QueryClient();

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
const SalesDataContext = createContext<SalesDataContextType | undefined>(undefined);

// Fetch Sales Data (with caching)
async function fetchSalesData() {
  const response = await axios.get("/api/sales");
  const data = response.data;
  if (data.error) throw new Error(data.error);

  const { monthlySales, previousMonthSales } = data;
  const growth =
    previousMonthSales > 0 ? ((monthlySales - previousMonthSales) / previousMonthSales) * 100 : null;

  return { salesData: { ...data, growth } };
}

// Provider component
export function SalesDataProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["salesData"],
    queryFn: fetchSalesData,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false, // No auto-refetch when switching tabs
  });

  // Optimized refetch function
  const refetch = async () => {
    try {
      const newData = await fetchSalesData();
      const cachedData = queryClient.getQueryData<{ salesData: SalesData }>(["salesData"]);

      if (JSON.stringify(newData.salesData) !== JSON.stringify(cachedData?.salesData)) {
        // Update cache only if data is different
        queryClient.setQueryData(["salesData"], newData);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  return (
    <SalesDataContext.Provider
      value={{
        salesData: data?.salesData || null,
        loading: isLoading,
        error: error ? error.message : null,
        refetch, // Provide optimized refetch function
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
    throw new Error("useSalesDataContext must be used within a SalesDataProvider");
  }
  return context;
}

// Wrap app with QueryClientProvider
export function SalesDataWrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
