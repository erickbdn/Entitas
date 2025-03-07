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
import {
  SalesDataProvider,
  SalesDataWrapper,
  useSalesDataContext,
} from "../context/SalesDataContext";

export default function Dashboard() {
  return (
    <SalesDataWrapper>
      <SalesDataProvider>
        <DashboardContent />
      </SalesDataProvider>
    </SalesDataWrapper>
  );
}

function DashboardContent() {
  const { refetch, loading } = useSalesDataContext();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounce function
  const debouncedRefetch = useCallback(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    
    debounceTimeout.current = setTimeout(() => {
      refetch();
    }, 1000); // 1-second debounce
  }, [refetch]);

  return (
    <div className="relative flex flex-col gap-4 pb-12">
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

      {/* Refresh Button - Positioned within the div */}
      <div className="absolute -top-2 -right-2">
        <button
          onClick={debouncedRefetch}
          disabled={loading}
          className="p-3 bg-accent text-secondary-lighter rounded-full shadow-lg disabled:opacity-50 flex items-center justify-center"
        >
          <RefreshCcw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}
