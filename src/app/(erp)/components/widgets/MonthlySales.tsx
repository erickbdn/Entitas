"use client";

import { DashboardWidget } from "../subcomponents/DashboardWidget";
import { useSalesDataContext } from "../../context/SalesDataContext";

export function MonthlySales() {
  const { salesData, loading, error } = useSalesDataContext();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <DashboardWidget
      title="Monthly Total Sales"
      className="col-span-4 text-secondary-lighter text-xl relative min-h-40 bg-transparent backdrop-blur-none"
      titleClassName="z-10 absolute top-4 left-4"
      contentClassName="p-0"
    >
      <div className="flex w-full h-full">
        {/* Sales Amount Section */}
        <div className="flex-1 flex items-center justify-center px-4 bg-accent text-secondary-light rounded-xl relative">
          <p className="text-5xl font-bold absolute bottom-2 right-4">
            ${salesData?.monthlySales.toLocaleString() || "0"}
          </p>
        </div>
        {/* Percentage Change Section */}
        {salesData && (
          <div className="w-1/3 flex items-center justify-center bg-accent text-secondary-lighter font-semibold rounded-xl relative">
            <p className="absolute top-2 pt-2 left-1/2 -translate-x-1/2 font-semibold text-base whitespace-nowrap">
              Sales Growth
            </p>
            <p className={`text-2xl font-bold ${salesData.growth !== null && salesData.growth < 0 ? "text-red-500" : "text-green-500"}`}>
              {salesData.growth !== null ? `${salesData.growth.toFixed(2)}%` : "N/A"}
            </p>
          </div>
        )}
      </div>
    </DashboardWidget>
  );
}
