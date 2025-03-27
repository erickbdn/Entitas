"use client";

import { getAuth } from "firebase/auth";
import { createContext, useContext, ReactNode } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Recent Transactions Data Structure
interface TransactionData {
  id: string;
  amount: string;
  date: string;
  relatedOrderId: string;
  status: string;
}

interface RecentTransactionsContextType {
  transactions: TransactionData[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Create context
const RecentTransactionsContext = createContext<RecentTransactionsContextType | undefined>(undefined);

// Fetch Recent Transactions Data with Auth
async function fetchRecentTransactions() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  // 🔹 Get Firebase Token
  const token = await user.getIdToken();
  const apiUrl = "http://localhost:3001/api/recent-transactions";

  const response = await axios.get(apiUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data;
  if (data.error) throw new Error(data.error);
  return { transactions: data };
}

// Provider component
export function RecentTransactionsProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["recentTransactions"],
    queryFn: fetchRecentTransactions,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  return (
    <RecentTransactionsContext.Provider
      value={{
        transactions: data?.transactions || null,
        loading: isLoading,
        error: error ? error.message : null,
        refetch,
      }}
    >
      {children}
    </RecentTransactionsContext.Provider>
  );
}

// Hook to use recent transactions data
export function useRecentTransactionsContext() {
  const context = useContext(RecentTransactionsContext);
  if (!context) {
    throw new Error("useRecentTransactionsContext must be used within a RecentTransactionsProvider");
  }
  return context;
}
