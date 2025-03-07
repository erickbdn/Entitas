"use client";

import { DashboardWidget } from "../subcomponents/DashboardWidget";
import { useSalesDataContext } from "../../context/SalesDataContext";

export function TodaysSales() {
  const { salesData, loading, error } = useSalesDataContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <DashboardWidget
      title="Today's Sales"
      className="col-span-3 text-accent text-xl bg-[#E9E1D8]/75 relative min-h-40"
      titleClassName="absolute top-4 left-4"
    >
      <p className="text-5xl font-bold absolute bottom-2 right-4">
        ${salesData?.todaySales.toLocaleString() || "0"}
      </p>
    </DashboardWidget>
  );
}
