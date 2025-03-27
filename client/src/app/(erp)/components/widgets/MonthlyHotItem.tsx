"use client";

import { useSalesDataContext } from "../../context/SalesDataContext";
import Image from "next/image";
import { DashboardWidget } from "../subcomponents/DashboardWidget";

export function MonthlyHotItem() {
  const { salesData, loading, error } = useSalesDataContext();

  if (loading || !salesData)
    return (
      <DashboardWidget title="Monthly Hot Item">
        Loading...
      </DashboardWidget>
    );
  if (error)
    return (
      <DashboardWidget title="Monthly Hot Item">
        Error loading data.
      </DashboardWidget>
    );
  if (!salesData.hotItem)
    return (
      <DashboardWidget title="Monthly Hot Item">
        No hot item found.
      </DashboardWidget>
    );

  const { name, imageUrl, stockRemaining, unitsSold, revenue } = salesData.hotItem;

  return (
    <DashboardWidget
      title="Monthly Hot Item"
      className="col-span-5 text-secondary-lighter relative min-h-40 flex"
      titleClassName="z-10 absolute top-4 left-4 shadow-md bg-[#E9E1D8]/75 rounded-lg p-1 text-accent"
      contentClassName="p-0"
    >
      {/* Left Side - Product Image & Name */}
      <div className="flex-[1.5] flex flex-col items-center justify-center rounded-2xl bg-gradient-to-t from-[#E9E1D8]/30 via-transparent to-transparent pb-6 pt-16">
        <Image
          src={imageUrl || "/PlaceholderItem.png"}
          alt={name || "Product"}
          width={150}
          height={150}
          className="rounded-md"
        />
        <p className="mt-4 font-semibold text-secondary-lighter drop-shadow-md">
          {name || "Unknown Product"}
        </p>
      </div>

      {/* Right Side - Stats */}
      <div className="flex flex-col flex-1 text-secondary-lighter">
        <div className="p-4 rounded-2xl shadow-md relative flex flex-col items-center justify-center flex-1 w-full">
          <p className="text-sm font-semibold absolute top-2 left-3">Units Sold</p>
          <p className="text-xl font-medium">{unitsSold}</p>
        </div>
        <div className="p-4 rounded-2xl shadow-md relative flex flex-col items-center justify-center flex-1 w-full">
          <p className="text-sm font-semibold absolute top-2 left-3">Revenue</p>
          <p className="text-xl font-medium">${revenue.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-2xl shadow-md relative flex flex-col items-center justify-center flex-1 w-full">
          <p className="text-sm font-semibold absolute top-2 left-3">Stock</p>
          <p className="text-xl font-medium">{stockRemaining}</p>
        </div>
      </div>
    </DashboardWidget>
  );
}
