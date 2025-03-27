"use client";

import { useCallback, useRef } from "react";
import { RefreshCcw } from "lucide-react";
import { InventoryLevels } from "../components/widgets/InventoryLevels";
import { MonthlyHotItem } from "../components/widgets/MonthlyHotItem";
import { MonthlySales } from "../components/widgets/MonthlySales";
import { PendingOrders } from "../components/widgets/PendingOrders";
import { RecentTransactions } from "../components/widgets/RecentTransactions";
import { TodaysSales } from "../components/widgets/TodaysSales";
import { WeeklySalesTrend } from "../components/widgets/WeeklySalesTrend";
import { SalesDataProvider } from "../context/SalesDataContext";
import { InventoryDataProvider } from "../context/InventoryDataContext";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { RecentTransactionsProvider } from "../context/RecentTransactionsContext";

// Create a query client instance
const queryClient = new QueryClient();

export default function Dashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecentTransactionsProvider>
        <InventoryDataProvider>
          <SalesDataProvider>
            <DashboardContent />
          </SalesDataProvider>
        </InventoryDataProvider>
      </RecentTransactionsProvider>
    </QueryClientProvider>
  );
}

function DashboardContent() {
  const queryClient = useQueryClient();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounced refresh function
  const debouncedRefetch = useCallback(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      queryClient.invalidateQueries(); // 🔥 Refresh all dashboard queries
    }, 1000); // 1-second debounce
  }, [queryClient]);

  return (
    <div className="relative flex flex-col gap-4 pb-12 px-1">
      {/* Dashboard Widgets */}
      <div className="grid grid-cols-10 gap-6 overflow-hidden">
        <TodaysSales />
        <MonthlySales />
        <WeeklySalesTrend />
        <MonthlyHotItem />
        <InventoryLevels />
        <RecentTransactions />
        <PendingOrders />
      </div>

      {/* Refresh Button */}
      <div className="absolute -top-2 -right-2">
        <button
          onClick={debouncedRefetch}
          className="p-3 bg-accent text-secondary-lighter rounded-full shadow-lg flex items-center justify-center"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
