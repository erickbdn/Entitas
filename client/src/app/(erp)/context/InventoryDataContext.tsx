"use client";

import { getAuth } from "firebase/auth";
import { createContext, useContext, ReactNode } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Inventory Data Structure
interface InventoryData {
  totalProducts: number;
  currentInventory: number;
  lowStockCount: number;
  outOfStockCount: number;
  maxCapacity: number;
}

interface InventoryContextType {
  inventoryData: InventoryData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Create context
const InventoryDataContext = createContext<InventoryContextType | undefined>(undefined);

// Fetch Inventory Data with Auth
async function fetchInventoryData() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  // 🔹 Get Firebase Token
  const token = await user.getIdToken();
  const apiUrl = "http://localhost:3001/api/inventory";

  const response = await axios.get(apiUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data;
  if (data.error) throw new Error(data.error);
  return { inventoryData: data };
}

// Provider component
export function InventoryDataProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["inventoryData"],
    queryFn: fetchInventoryData,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  return (
    <InventoryDataContext.Provider
      value={{
        inventoryData: data?.inventoryData || null,
        loading: isLoading,
        error: error ? error.message : null,
        refetch,
      }}
    >
      {children}
    </InventoryDataContext.Provider>
  );
}

// Hook to use inventory data
export function useInventoryDataContext() {
  const context = useContext(InventoryDataContext);
  if (!context) {
    throw new Error("useInventoryDataContext must be used within an InventoryDataProvider");
  }
  return context;
}
