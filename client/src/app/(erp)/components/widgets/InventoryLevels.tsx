"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { DashboardWidget } from "../subcomponents/DashboardWidget";
import { Package } from "lucide-react";
import { useInventoryDataContext } from "../../context/InventoryDataContext";

export function InventoryLevels() {
  const { inventoryData, loading } = useInventoryDataContext();
  const pieChartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!inventoryData || !pieChartRef.current) return;
  
    // Ensure safe values
    const maxCapacity = 500; // Change this to fetch dynamically if needed
    const currentInventory = inventoryData.totalProducts ?? 0;

    // Avoid division by zero
    const inventoryPercentage = maxCapacity > 0 ? (currentInventory / maxCapacity) * 100 : 0;
  
    const width = 150;
    const height = 150;
    const radius = Math.min(width, height) / 2;
  
    const data = [
      { label: "Used", value: currentInventory },
      { label: "Remaining", value: Math.max(maxCapacity - currentInventory, 0) }, // Ensure no negative values
    ];
  
    const color = d3.scaleOrdinal(["#2E4052", "#2E405210"]);
  
    const arc = d3
      .arc<d3.PieArcDatum<(typeof data)[0]>>()
      .innerRadius(50)
      .outerRadius(radius)
      .cornerRadius(8);
  
    const pie = d3.pie<(typeof data)[0]>().value((d) => d.value);
  
    const svg = d3.select(pieChartRef.current);
    svg.selectAll("*").remove(); // Clear old chart
  
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);
  
    g.selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc as string | ((d: d3.PieArcDatum<(typeof data)[0]>) => string | null) | null)
      .attr("fill", (_, i) => color(i.toString()) as string)
      .transition()
      .duration(2000)
      .ease(d3.easeExpOut)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t))!;
        };
      });
  
    // Add Percentage Text in Center
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "18px")
      .attr("fill", "#E9E1D8")
      .text(`${inventoryPercentage.toFixed(1)}%`);
  }, [inventoryData]);
  
  

  return (
    <DashboardWidget
      title="Inventory Levels"
      className="col-span-5 text-secondary-lighter relative min-h-40 flex"
      titleClassName="z-10 absolute top-4 left-4 text-secondary-lighter"
      contentClassName="p-0"
    >
      {/* Show Loading when data is not available */}
      {loading || !inventoryData ? (
        <p className="text-center w-full py-6">Loading inventory data...</p>
      ) : (
        <>
          {/* Left Side - Pie Chart */}
          <div className="flex-[1.5] flex flex-col items-center justify-center rounded-2xl pb-6 pt-16">
            <svg ref={pieChartRef} className="w-[150px] h-[150px] font-semibold" />
            <div className="flex items-center gap-2 pt-4">
              <Package size="1em" strokeWidth={2.5} className="text-secondary-lighter" />
              <p className="text-secondary-lighter font-semibold">
  {inventoryData.totalProducts} / {500} Max
</p>

            </div>
          </div>

          {/* Right Side - Stats */}
          <div className="flex flex-col flex-1 text-secondary-lighter">
            <div className="p-4 rounded-2xl shadow-md relative flex flex-col items-center justify-center flex-1 w-full">
              <p className="text-sm font-semibold absolute top-2 left-3">Total Products</p>
              <p className="text-xl font-medium">{inventoryData.totalProducts}</p>
            </div>
            <div className="p-4 rounded-2xl shadow-md relative flex flex-col items-center justify-center flex-1 w-full">
              <p className="text-sm font-semibold absolute top-2 left-3">Low Stock Items</p>
              <p className="text-xl font-medium">{inventoryData.lowStockCount}</p>
            </div>
            <div className="p-4 rounded-2xl shadow-md relative flex flex-col items-center justify-center flex-1 w-full">
              <p className="text-sm font-semibold absolute top-2 left-3">Out of Stock Items</p>
              <p className="text-xl font-medium">{inventoryData.outOfStockCount}</p>
            </div>
          </div>
        </>
      )}
    </DashboardWidget>
  );
}

